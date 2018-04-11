const express = require('express');
const bodyParser = require('body-parser');

const { clientResponse } = require('../utils/client_response');
const { isAuthorized } = require('./middleware');
const logger = require('../utils/logger');
const User = require('../models/user');
const { getAuthToken, getMyInfo } = require('../services/spotify');

const router = express.Router();
router.use(bodyParser.json());
router.param('id', isAuthorized);

// GET /:id
router.get('/:id', (req, res) => {
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
  const code = req.body.code;
  const redirect_uri = req.body.redirect_uri;

  let data = {};

  // Make request to spotify API for auth token & refresh token
  getAuthToken(code, redirect_uri)
    .then((json) => {
      data.spotifyToken = json['access_token'] || '';
      data.spotifyRefreshToken = json['refresh_token'] || '';

      // Return call to fetch the user's info
      return getMyInfo(data.spotifyToken);
    })
    .then((json) => {
      data.spotifyID = json['id'] || '';

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
    })
    .catch((err) => {
      logger.error(err);
      return clientResponse(res, 400, ['Unable to get auth token.']);
    });
});

module.exports = router;