const cp = require('child_process');
const worker = cp.fork('./services/worker');
const Transfer = require('../models/transfer');
const logger = require('../utils/logger');

// Migrate the playlist
const migrate = (transfer_obj) => {
  worker.send({ transfer: transfer_obj });
};

worker.on('message', (data) => {
  if (data.type === 'update') {
    Transfer.findByIdAndUpdate(data.p_id, { status: data.new_status }, { new: true })
      .then((updated) => {
        logger.info(`Status update on playlist transfer: ${updated._id} - ${updated.status}`);
      })
      .catch((err) => {
        // The transfer probbaly doesn't exist if this is triggered
        logger.error(err);
        // Cancel the action?
        // TODO: figure a way to cancel the action
      });
  }
});

module.exports = {
  migrate
};