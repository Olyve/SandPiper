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
  // Route Tests
  require('./routes/auth');
  require('./routes/middleware');
  require('./routes/user');
});