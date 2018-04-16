const bodyParser = require('body-parser');
const express = require('express');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const { getUserFromDB } = require('./middleware');
const {
  getPlaylist,
  myPlaylists,
  search
} = require('../services/spotify');

const router = express.Router();
router.use(bodyParser.json());
router.use(getUserFromDB);

// Search using a search term
router.get('/search', (req, res) => {
  // Do some validation on query
  let search_term = req.query.search_term;
  if (search_term === '' || search_term === undefined) {
    return clientResponse(res, 400);
  }

  // Make request to SpotifyAPI
  return search(req.user, search_term)
    .then((json) => {
      // Return the json from the Spotify API
      clientResponse(res, 200, ['Returning search results.'], { results: json });
    })
    .catch((err) => {
      logger.error(err);
      clientResponse(res, 400);
    });
});

// Get playlists for the currently logged in user
router.get('/playlists', (req, res) => {
  return myPlaylists(req.user)
    .then((json) => {
      // Return the json from the Spotify API
      clientResponse(res, 200, ['Returning user\'s playlists.'], { results: json });
    })
    .catch((err) => {
      logger.error(err);
      clientResponse(res, 400);
    });
});

// Get a specific playlist, including the tracks and info
router.post('/playlist', (req, res) => {
  return getPlaylist(req.user, req.body.url)
    .then((json) => {
      // Return the json from the API
      clientResponse(res, 200, ['Returning playlist.'], { results: json });
    })
    .catch((err) => {
      logger.error(err);
      clientResponse(res, 400);
    });
});

module.exports = router;
