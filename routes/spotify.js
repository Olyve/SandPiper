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

      // Do some validation on query
      let search_term = req.query.search_term;
      if (search_term === '' || search_term === undefined) {
        throw new Error('Search term cannot be empty.');
      }

      // Make request to SpotifyAPI
      return search(user, search_term).then((json) => {
        // Return the json from the Spotify API
        clientResponse(res, 200, ['Returning search results.'], { results: json });
      });
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
      return playlists(user).then((json) => {
        // Return the json from the Spotify API
        clientResponse(res, 200, ['Returning user\'s playlists.'], { results: json });
      });
    })
    .catch((err) => {
      logger.error(err);
      // Return bad request
      return clientResponse(res, 400);
    });
});

module.exports = router;
