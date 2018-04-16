const bodyParser = require('body-parser');
const express = require('express');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');
const { getUserFromDB } = require('./middleware');
const {
  generateToken,
  getMyPlaylists,
  getPlaylist
} = require('../services/apple');

const router = express.Router();
router.use(bodyParser.json());
router.use(getUserFromDB);

router.get('/generateToken', (req, res) => {
  let token = generateToken();

  req.user.appleDevToken = token;
  req.user.save((err) => {
    if (!err) {
      clientResponse(res, 200, ['Returning token.'], { token: token });
    }
    else { clientResponse(res, 400); }
  });
});

// Used to fetch the user's playlists from Apple Music
router.get('/playlists', (req, res) => {
  // Return the user's playlists
  return getMyPlaylists(req.user)
    .then((json) => {
      clientResponse(res, 200, ['Returning playlists.'], { playlists: json });
    })
    .catch((err) => {
      logger.error(err);
      clientResponse(res, 400);
    });
});

// Used to fetch a specific playlist and its tracks
router.get('/playlists/:id', (req, res) => {
  return getPlaylist(req.user, req.params.id)
    .then((json) => {
      clientResponse(res, 200, ['Returning playlist.'], { playlist: json });
    })
    .catch((err) => {
      logger.error(err);
      clientResponse(res, 400);
    });
});

module.exports = router;