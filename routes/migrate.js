const bodyParser = require('body-parser');
const express = require('express');

const { clientResponse } = require('../utils/client_response');
const logger = require('../utils/logger');
const { getUserFromDB } = require('./middleware');
const appleService = require('../services/apple');
const spotifyService = require('../services/spotify');
const subprocess = require('../services/threading');

const router = express.Router();
router.use(bodyParser.json());
router.use(getUserFromDB);

router.post('/migrate', (req, res) => {
  const user = req.user;
  const source = req.body.source;

  // Get the playlist so we have info to create on target service
  getPlaylist(user, source, req.body.playlist_id)
    .then((json) => {
      let playlist = json['data'][0];

      // Offload to child process here
      subprocess.migrate(playlist, user, source, req.body.target);

      // Respond with accepted (task may take time to process)
      return clientResponse(res, 202);
    })
    .catch((err) => {
      logger.error(err);
      clientResponse(res, 400);
    });
});

// Helper functions
const getPlaylist = (user, source, playlistId) => {
  if (source === 'apple') {
    return appleService.getPlaylist(user, playlistId);
  }
  else if (source === 'spotify') {
    return spotifyService.getPlaylist(user, playlistId);
  }
  else {
    throw new Error('Source was not a recognized value.');
  }
};

module.exports = router;