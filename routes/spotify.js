const bodyParser = require('body-parser');
const express = require('express');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');
const { search, playlists } = require('../services/spotify');

const router = express.Router();
router.use(bodyParser.json());

router.get('/search', (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      // Return 401 if the user is not found
      if (!user) { return clientResponse(res, 401); }

      // Make request to SpotifyAPI
      return search(req.query.search_term, user);
    })
    .then((json) => {
      // TODO: Remove for production
      console.log(json);
      // Return the json form the Spotify API
      return clientResponse(res, 200, ['Returning search results.'], { results: json });
    })
    .catch((err) => {
      logger.error(err);
      // Return Bad Request
      return clientResponse(res, 400);
    });
});

router.get('/playlists', (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      // Return 401 if the user is not found
      if (!user) { return clientResponse(res, 401); }

      // Make request to Spotify API
      return playlists(user);
    })
    .then((json) => {
      // TODO: Remove for production
      console.log(json);

      return clientResponse(res, 200, ['Returning user\'s playlists'], { results: json });
    })
    .catch((err) => {
      logger.error(err);
      // Return bad request
      return clientResponse(res, 400);
    });
});

module.exports = router;
