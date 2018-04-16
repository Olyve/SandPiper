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
  let country_code = 'us';
  let ids = track_ids.reduce((acc, cur) => `${acc},${cur}`);
  return rp.get({
    url: `https://api.music.apple.com/v1/catalog/${country_code}/songs`,
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

module.exports = {
  generateToken,
  getMyPlaylists,
  getPlaylist,
  getTracks
};