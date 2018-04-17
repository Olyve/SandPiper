/*
 * This module manages the actual transfer of the Spotify
 * playlist to Apple Music.
 */

const logger = require('../utils/logger');
const appleService = require('./apple');

async function transferToAppleMusic(transfer_obj) {
  let user = transfer_obj.user;

  try {
    let appleTrackIds = await isrcToAppleMusicId(user, transfer_obj.tracks);
    let playlist = await appleService.createPlaylist(user, transfer_obj.playlist_name);
    let playlist_id = playlist.data[0].id;
    await appleService.addTracksToPlaylist(user, playlist_id, appleTrackIds);

    // Sucessfully completed the transfer, notify main thread to update transfer_obj
    process.send({ type: 'update', p_id: transfer_obj._id, new_status: 'completed' });
  }
  catch(err) {
    logger.error(`Worker: ${err}`);
    // An error occured and we couldn't complete the transfer, notify main thread to update
    process.send({ type: 'update', p_id: transfer_obj._id, new_status: 'failed' });
  }
}

// TODO: Fix that this function has O(n)^2 run time worst case scenario
async function isrcToAppleMusicId(user, search_objs) {
  let appleIds = [];
  let searches = search_objs.map(search => { return JSON.parse(search);} );

  // Convert objects to Apple Music ID's
  for (let search of searches) {
    let search_term = `${search.name} ${search.artist} ${search.album}`;
    let result = await appleService.search(user, search_term);

    // Check that the results did not return an empty array,
    // if so it means Apple Music likely doesn't have the song
    if (result.results.songs !== undefined) {
      // Loop through returned search results to find the right song
      // and add it's id to appleIds
      for (let track of result.results.songs.data) {
        if (track.attributes.isrc === search.id) {
          // Formatting the id's for the Apple Music endpoint
          let id = {'id': track.id, 'type': 'songs'};
          appleIds.push(id);
          break;
        }
      }
    }
  }

  return appleIds;
}

module.exports = {
  transferToAppleMusic
};
