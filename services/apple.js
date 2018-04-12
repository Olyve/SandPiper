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

module.exports = {
  generateToken
};