const bodyParser = require('body-parser');
const express = require('express');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');
const {
  generateToken,
  getMyPlaylists
} = require('../services/apple');

const router = express.Router();
router.use(bodyParser.json());

router.get('/generateToken', (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      // Return 401 if the user is not found
      if (!user) { return clientResponse(res, 401); }

      let token = generateToken();

      user.appleDevToken = token;
      user.save((err) => {
        if (!err) {
          clientResponse(res, 200, ['Returning token.'], { token: token });
        }
        else { clientResponse(res, 400); }
      });
    });
});

// Used to fetch the user's playlists from Apple Music
router.get('/playlists', (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      // Return 401 if the user is not found
      if (!user) { return clientResponse(res, 401); }

      // Return the user's playlists
      return getMyPlaylists(user, generateToken()).then((json) => {
        clientResponse(res, 200, ['Returning playlists.'], { results: json });
      });
    })
    .catch((err) => {
      logger.error(err);
      // Return Bad Request
      return clientResponse(res, 400);
    });
});

module.exports = router;