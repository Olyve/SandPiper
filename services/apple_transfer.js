/*
 * This module manages the actual transfer of the Apple Music
 * playlist to Spotify.
 */

const logger = require('../utils/logger');
const appleService = require('./apple');
const spotifyService = require('./spotify');

// Use to transfer an AM playlist to Spotify
async function transferToSpotify(transfer_obj) {
  let user = transfer_obj.user;
  
  try {
    let isrcNumbers = await tracksToISRC(user, transfer_obj.tracks);
    let results = await isrcToSpotifyURI(user, isrcNumbers);
    let new_playlist = await spotifyService.createPlaylist(user, transfer_obj.playlist_name);
    await spotifyService.addTracks(user, new_playlist['id'], results);

    // Sucessfully completed the transfer, notify main thread to update transfer_obj
    process.send({ type: 'update', p_id: transfer_obj._id, new_status: 'completed' });
  }
  catch(err) {
    logger.error(`Worker: ${err}`);
    // An error occured and we couldn't complete the transfer, notify main thread to update
    process.send({ type: 'update', p_id: transfer_obj._id, new_status: 'failed' });
  }
}

async function tracksToISRC(user, tracks) {
  // Convert library id to catalog id ex: p.201281527 -> 201281527
  let trackIDs = tracks.map((id) => { return id.split('.')[1]; });

  let result = await appleService.getTracks(user, trackIDs);
  let isrcNumbers = result['data'].map((track) => {
    return track['attributes']['isrc'];
  });
  return isrcNumbers;
}

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

module.exports = {
  transferToSpotify
};