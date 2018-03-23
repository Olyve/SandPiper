const bodyParser = require('body-parser');
const express = require('express');
const base64 = require('base-64');

const {clientResponse} = require('../utils/client_response');
const User = require('../models/user');
const { search, refreshAuthToken } = require('../services/spotify');

const router = express.Router();
router.use(bodyParser.json());

router.get('/spotify', (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      // Return 401 if the user is not found
      if (!user) { return clientResponse(res, 401); }

      // Make request to SpotifyAPI
      return search(req.query.search_term, user);
    })
    .then((json) => {
      console.log(json);
      // if (json['error'] !== undefined && json['error']['status'] == 400) {
      //   return clientResponse(res, 400);
      // }

      // Return the json form the Spotify API
      return clientResponse(res, 200, ['Returning search results.'], { results: json });
    })
    .catch((err) => {
      console.log('Status Code: ' + err.statusCode);
      console.log(err.message);

      // Return Bad Request
      return clientResponse(res, 400);
    });
});

module.exports = router;
