const rp = require('request-promise-native');
const appleService = require('./apple');
const spotifyService = require('./spotify');
const logger = require('../utils/logger');
// const ISRCMap = require('../models/isrc_map');

process.on('message', (data) => {
  let transfer = data.transfer;
  logger.info(`Starting migration of - ${transfer._id}`);

  // Notify parent that migration has started
  process.send({ type: 'update', p_id: transfer._id, new_status: 'pending' });

  if (transfer.source === 'apple') {
    let user = transfer.user;

    appleTracksToISRC(user, transfer.tracks)
    .then((isrcNumbers) => {
      return isrcToSpotifyURI(user, isrcNumbers)
    })
    .then((results) => {
      return spotifyService.createPlaylist(user, transfer.playlist_name)
        .then((json) => {
          let playlist_id = json['id'];
          return spotifyService.addTracks(user, playlist_id, results);
        })
        .then((json) => {
          process.send({ type: 'update', p_id: transfer._id, new_status: 'completed' });
        });
    })
    .catch((err) => {
      logger.error(`Worker: ${err}`);
      process.send({ type: 'update', p_id: transfer._id, new_status: 'failed' });
    });
  }
});

async function appleTracksToISRC(user, tracks) {
  // Convert library id to catalog id ex: p.201281527 -> 201281527
  let trackIDs = tracks.map((id) => { return id.split('.')[1]; });

  let result = await appleService.getTracks(user, trackIDs);
  let isrcNumbers = result['data'].map((track) => {
    return track['attributes']['isrc'];
  });
  return isrcNumbers;
};

async function isrcToSpotifyURI(user, isrcNumbers) {
  let spotifyURIs = [];
  for (let number of isrcNumbers) {
    let result = await spotifyService.isrcSearch(user, number);
    if (result['tracks']['items'][0] !== undefined) {
      spotifyURIs.push(result['tracks']['items'][0]['uri']);
    }
  }
  return spotifyURIs;
}