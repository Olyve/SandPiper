const rp = require('request-promise-native');
const appleService = require('./apple');
const spotifyService = require('./spotify');

process.on('message', (data) => {
  console.log('Starting Migration:');
  if (data.source === 'apple') {
    let tracks = data.playlist['relationships']['tracks']['data'];
    let name = data.playlist['attributes']['name'];

    tracksToISRC(data.user, tracks)
    .then((isrcNumbers) => {
      return isrcToSpotifyURI(data.user, isrcNumbers)
    })
    .then((results) => {
      return spotifyService.createPlaylist(data.user, name)
        .then((json) => {
          let playlist_id = json['id'];
          return spotifyService.addTracks(data.user, playlist_id, results)
        })
        .then((json) => {
          console.log(json);
        });
    });
  }
});

async function tracksToISRC(user, tracks) {
  let isrcNumbers = [];
  for (let track of tracks) {
    let result = await appleService.getTrack(user, track.id);
    let isrc = result['data'][0]['attributes']['isrc'];
    isrcNumbers.push(isrc);
  }
  return isrcNumbers;
};

async function isrcToSpotifyURI(user, isrcNumbers) {
  let spotifyURIs = [];
  for (let number of isrcNumbers) {
    let result = await spotifyService.isrcSearch(user, number);
    let uri = result['tracks']['items'][0]['uri'];
    spotifyURIs.push(uri);
  }
  return spotifyURIs;
}