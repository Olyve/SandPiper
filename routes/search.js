const bodyParser = require('body-parser');
const express = require('express');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');
const SpotifyAPI = require('../services/spotify');

const router = express.Router();
router.use(bodyParser.json());

router.get('/spotify', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    // Return 401 if the user is not found
    if (!user) { return clientResponse(res, 401); }

    // Make request to SpotifyAPI
    SpotifyAPI.search(req.query.search_term, user.spotifyToken)
      .then((json) => {
        console.log(json);
        if (json['error'] !== undefined && json['error']['status'] == 400) {
          return clientResponse(res, 400);
        }

        // Return the json form the Spotify API
        return clientResponse(res, 200, ['Returning search results.'], { results: json });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }

        // Return Bad Request
        return clientResponse(res, 400);
      });
  });
});

module.exports = router;