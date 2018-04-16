const rp = require('request-promise-native');
const jwt = require('jsonwebtoken');

const generateToken = () => {
  let issued = Math.floor(Date.now() / 1000);
  let expires = issued + (60 * 60 * 24 * 30);

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

const getTrack = (user, track_id) => {
  track_id = track_id.split('.')[1];
  let country_code = 'us';
  return rp.get({
    url: `https://api.music.apple.com/v1/catalog/${country_code}/songs/${track_id}`,
    headers: {
      'Authorization': `Bearer ${user.appleDevToken}`,
      'Music-User-Token': user.appleMusicToken
    },
    simple: true,
    json: true
  });
};

module.exports = {
  generateToken,
  getMyPlaylists,
  getPlaylist,
  getTrack
};