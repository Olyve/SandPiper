const cp = require('child_process');
const worker = cp.fork('./services/worker.js');

// Migrate the playlist
const migrate = (playlist, user, source, target) => {
  worker.send({
    playlist: playlist,
    user: user,
    source: source,
    target: target
  });
};

// worker.on('message', (data) => {
//   //
// });

module.exports = {
  migrate
};