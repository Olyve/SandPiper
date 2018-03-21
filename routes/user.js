const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise-native');
const base64 = require('base-64');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');

const router = express.Router();
router.use(bodyParser.json());

// GET /:id
router.get('/:id', (req, res) => {
  // If not authorized to make request, return 404
  if (!isAuthorized(req)) {
    return clientResponse(res, 404);
  }

  User.findById(req.params.id, (err, user) => {
    if (err) {
      // Log error to console and return 400
      logger.error(`Find User Error: ${err}`);
      return clientResponse(res, 400);
    }

    // No user exists with that id
    // We return 401 to ensure we don't leak information
    if (!user) { return clientResponse(res, 401); }

    // Proceed to return the User
    return clientResponse(res, 200, ['Returning found user.'], user);
  });
});

// PUT /:id
router.put('/:id', (req, res) => {
  // If not authorized to make request, return 404
  if (!isAuthorized(req)) {
    return clientResponse(res, 404);
  }

  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    if (err) {
      // Log error to console and return 400
      logger.error(`Find User and Update Error: ${err}`);
      return clientResponse(res, 400);
    }

    // No user exists with that id, return 401
    if (!user) { return clientResponse(res, 401); }

    // Everything worked, return the updated user
    return clientResponse(res, 200, ['User updated successfully.']);
  });
});

// POST /:id/spotifyAuth
router.post('/:id/spotifyAuth', (req, res) => {
  // If not authorized to make request, return 404
  if (!isAuthorized(req)) {
    return clientResponse(res, 404);
  }

  const code = req.body.code;
  const redirect_uri = req.body.redirect_uri;
  const auth = base64.encode(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);

  // Make request to spotify API
  rp.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    },
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    simple: false,
    json: true, // automatically parses json response string
    resolveWithFullResponse: false
  }).then((json) => {
    console.log(json);
    let data = {
      spotifyToken: json['access_token'],
      spotifyRefreshToken: json['refresh_token']
    };

    User.findByIdAndUpdate(req.params.id, data, (err, user) => {
      if (err) {
        // Log error to console and return 400
        logger.error(`Find User and Update Error: ${err}`);
        return clientResponse(res, 400);
      }

      // No user exists with that id, return 401
      if (!user) { return clientResponse(res, 401); }

      // Everything worked, return the updated user
      return clientResponse(res, 200, ['User updated successfully.']);
    });
  }).catch((err) => {
    console.log(err);
  });
});

// Verifies user is allowed to make request
function isAuthorized(req) {
  return req.params.id == req.user._id;
}

module.exports = router;