// Required components from common
const {db_connect} = require('./common');

// Setup test db
before((done) => {
  db_connect.open().then(() => { done(); }).catch(done);
});

// Tear down test db
after((done) => {
  db_connect.close().then(() => { done(); }).catch(done);
});

describe('Running Sandpiper tests...', () => {
  describe('Testing routes...', () => {
    require('./routes/auth.test');
    require('./routes/middleware.test');
    require('./routes/spotify.test');
    require('./routes/user.test');
  });

  describe('Testing services...', () => {
    require('./services/spotify.test');
  });
});