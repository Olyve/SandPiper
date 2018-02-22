process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const db_connect = require('../utils/db');
const server = require('../app');
const User = require('../models/user');

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
  // Reset database before each test
  beforeEach((done) => {
    User.remove({}, (err) => { done(); });
  });

  // ============================
  //
  //  Test Registering a New User
  //  
  // ============================
  
  describe('POST /register', () => {
    context('User creation fails when', () => {
      it('email address is missing', (done) => {
        let user = {
          email: '',
          password: 'password'
        };

        chai.request(server)
            .post('/register')
            .send(user)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property('status').eql('Failed');
              res.body.should.have.property('messages');
              res.body.messages.should.contain('Path `email` is required.');
              done();
            });
      });

      it('email address is not valid', (done) => {
        let user = {
          email: 'not an email!',
          password: 'password'
        };

        chai.request(server)
            .post('/register')
            .send(user)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property('status').eql('Failed');
              res.body.should.have.property('messages');
              res.body.messages.should.contain('Not a valid email address.');
              done();
            });
      });

      it('password is missing', (done) => {
        let user = {
          email: 'user@mail.com',
          password: ''
        };

        chai.request(server)
            .post('/register')
            .send(user)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property('status').eql('Failed');
              res.body.should.have.property('messages');
              res.body.messages.should.contain('Path `password` is required.');
              done();
            });
      });

      it('password is too short', (done) => {
        let user = {
          email: 'user@mail.com',
          password: 'short'
        };

        chai.request(server)
            .post('/register')
            .send(user)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property('status').eql('Failed');
              res.body.should.have.property('messages');
              res.body.messages.should.contain('Password is too short.');
              done();
            });
      });

      it('a user already exists with provided email', (done) => {
        let user = new User({
          email: 'user@mail.com',
          password: 'password'
        });

        user.save((err) => {
          chai.request(server)
              .post('/register')
              .send({
                email: 'user@mail.com',
                password: 'password'
              })
              .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('status').eql('Forbidden');
                res.body.should.have.property('messages');
                res.body.messages.should.contain('A user already exists with that email.');
                done();
              });
        });
      });
    });

    context('User creation succeeds when', () => {
      it('properties are valid', (done) => {
        let user = {
          email: 'user@mail.com',
          password: 'password'
        };

        chai.request(server)
            .post('/register')
            .send(user)
            .end((err,res) => {
              res.should.have.status(201);
              res.body.should.have.property('status').eql('Success');
              res.body.should.have.property('messages');
              res.body.messages.should.contain('User successfully created.');
              done();
            });
      });
    });
  });

});