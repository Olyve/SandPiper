process.env.NODE_ENV = 'test';

const db_connect = require('../utils/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

// Setup test db
before((done) => {
  db_connect.open().then(() => { done(); }).catch(done);
});

// Tear down test db
after((done) => {
  db_connect.close().then(() => { done(); }).catch(done);
});

describe('Authentication', () => {
  it('is just a placeholder', (done) => {
    done();
  });
});