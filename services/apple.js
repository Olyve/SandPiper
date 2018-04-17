const rp = require('request-promise-native');
const jwt = require('jsonwebtoken');

const generateToken = () => {
  let issued = Math.floor(Date.now() / 1000);
  let expires = issued + (60 * 60 * 24 * 90);

  let options = {
    algorithm: 'ES256',
    keyid: process.env.APPLE_KEY_ID
  };

  let payload = {
    iss: process.env.APPLE_TEAM_ID,
    exp: expires,
    iat: issued
  };

  return jwt.sign(payload, process.env.APPLE_DEV_KEY, options);
};

const getMyPlaylists = (user) => {
  return rp.get({
    url: 'https://api.music.apple.com/v1/me/library/playlists',
    headers: {
      'Authorization': `Bearer ${user.appleDevToken}`,
      'Music-User-Token': user.appleMusicToken
    },
    simple: true,
    json: true
  });
};

const getPlaylist = (user, playlist_id) => {
  return rp.get({
    url: `https://api.music.apple.com/v1/me/library/playlists/${playlist_id}`,
    qs: {
      include: 'tracks'
    },
    headers: {
      'Authorization': `Bearer ${user.appleDevToken}`,
      'Music-User-Token': user.appleMusicToken
    },
    simple: true,
    json: true
  });
};

const getTracks = (user, track_ids) => {
  let cc = user.appleMusicCountryCode;
  let ids = track_ids.reduce((acc, cur) => `${acc},${cur}`);
  return rp.get({
    url: `https://api.music.apple.com/v1/catalog/${cc}/songs`,
    qs: {
      ids: ids
    },
    headers: {
      'Authorization': `Bearer ${user.appleDevToken}`,
    },
    simple: true,
    json: true
  });
};

const search = (user, search_term) => {
  let cc = user.appleMusicCountryCode;
  return rp.get({
    url: `https://api.music.apple.com/v1/catalog/${cc}/search`,
    qs: {
      term: search_term,
      limit: 5,
      types: 'songs'
    },
    headers: {
      'Authorization': `Bearer ${user.appleDevToken}`
    },
    simple: true,
    json: true
  });
};

const createPlaylist = (user, p_name, track_ids) => {
  return rp.post({
    url: 'https://api.music.apple.com/v1/me/library/playlists',
    headers: {
      'Authorization': `Bearer ${user.appleDevToken}`,
      'Music-User-Token': user.appleMusicToken
    },
    body: {
      attributes: {
        name: p_name
      },
      relationships: {
        tracks: {
          data: track_ids
        }
      }
    },
    simple: true,
    json: true
  });
};

module.exports = {
  generateToken,
  getMyPlaylists,
  getPlaylist,
  getTracks,
  search,
  createPlaylist
};