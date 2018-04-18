const appleTransfer = require('./apple_transfer');
const spotifyTransfer = require('./spotify_transfer');
const logger = require('../utils/logger');

process.on('message', (data) => {
  let transfer = data.transfer;
  logger.info(`Starting migration of - ${transfer._id}`);

  // Notify parent that migration has started
  process.send({ type: 'update', p_id: transfer._id, new_status: 'pending' });

  switch (transfer.source) {
  case 'apple':
    appleTransfer.transferToSpotify(transfer);
    break;
  case 'spotify':
    spotifyTransfer.transferToAppleMusic(transfer);
    break;
  }
});