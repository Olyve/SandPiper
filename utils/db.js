const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function open() {
  return new Promise((resolve, reject) => {
    if(process.env.NODE_ENV === 'test') {
      const {Mockgoose} = require('mockgoose');
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage().then(() => {
        mongoose.connect('mongodb://localhost/testing-db', (err) => {
          if(err) { return reject(err); }
          resolve();
        });
      }).catch(reject);
    }
    else {
      let db_url = process.env.MONGODB_URI || 'mongodb://localhost/sandpiper-api';
      mongoose.connect(db_url, (err) => {
        if (err) { return reject(err); }
        resolve();
      });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { close, open };