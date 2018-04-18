const bodyParser = require('body-parser');
const express = require('express');

const { clientResponse } = require('../utils/client_response');
const logger = require('../utils/logger');
const { getUserFromDB } = require('./middleware');
const subprocess = require('../services/threading');
const Transfer = require('../models/transfer');

const router = express.Router();
router.use(bodyParser.json());
router.use(getUserFromDB);

router.post('/migrate', (req, res) => {
  let transfer = new Transfer({
    user: req.user._id,
    source: req.body.source,
    target: req.body.target,
    playlist_name: req.body.playlist_name,
    tracks: req.body.track_ids,
    status: 'queued'
  });

  // Save transfer object, populate the user, then send to the subprocess
  transfer.save()
    .then((transfer_obj) => { return transfer_obj.populate('user').execPopulate(); })
    .then((transfer) => {
      // Send transfer object to child for processing.
      subprocess.migrate(transfer);

      // Respond with accepted (task may take time to process)
      return clientResponse(res, 202, ['Your transfer is queued.'], { ref_id: transfer._id });
    })
    .catch((err) => {
      logger.error(err);
      clientResponse(res, 400, ['Your transfer could not be queued because of an error.']);
    });
});

module.exports = router;