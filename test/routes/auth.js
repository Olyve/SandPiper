// Import required components from common
const {
  chai,
  server,
  User
} = require('../common.js');

describe('Authentication', () => {
  // ============================
  //
  //  Test Registering a New User
  //  
  // ============================
  
  describe('POST /register', () => {
    // Reset database before each test
    beforeEach((done) => {
      User.remove({}, () => { done(); });
    });

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
            res.body.should.have.property('status').eql('Bad Request');
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
            res.body.should.have.property('status').eql('Bad Request');
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
            res.body.should.have.property('status').eql('Bad Request');
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
            res.body.should.have.property('status').eql('Bad Request');
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

        user.save(() => {
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
            res.body.should.have.property('status').eql('Created');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('User successfully created.');
            done();
          });
      });
    });
  });

  // ============================
  //
  //  Test Logging in a User
  //  
  // ============================

  describe('POST /login', () => {
    // Set up user to test logging in
    before((done) => {
      let user = new User({
        email: 'test@mail.com',
        password: 'password'
      });

      user.save((err) => {
        if (err) {
          console.log(err);
        }

        done();
      });
    });

    context('returns success and a token when', () => {
      it('credentials are valid and match a user', (done) => {
        chai.request(server)
          .post('/login')
          .set('Content-Type', 'application/json')
          .send({
            email: 'test@mail.com',
            password: 'password'
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('Success');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('User successfully logged in.');
            res.body.should.have.property('data');
            res.body.data.should.have.property('token');
            res.body.data.should.have.property('user_id');
            done();
          });
      });
    });

    context('returns unauthorized request when', () => {
      it('email does not match a user\'s email', (done) => {
        chai.request(server)
          .post('/login')
          .set('Content-Type', 'application/json')
          .send({
            email: 'not@mail.com',
            password: 'password'
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').eql('Unauthorized');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('Please check credentials and try again.');
            done();
          });
      });

      it('password does not match the user\'s password', (done) => {
        chai.request(server)
          .post('/login')
          .set('Content-Type', 'application/json')
          .send({
            email: 'test@mail.com',
            password: 'incorrect'
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').eql('Unauthorized');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('Please check credentials and try again.');
            done();
          });
      });
    });

    context('returns bad request when', () => {
      it('the email field is empty', (done) => {
        chai.request(server)
          .post('/login')
          .set('Content-Type', 'application/json')
          .send({
            email: '',
            password: 'password'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql('Bad Request');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('One or more fields were empty.');
            done();
          });
      });

      it('the password field is empty', (done) => {
        chai.request(server)
          .post('/login')
          .set('Content-Type', 'application/json')
          .send({
            email: 'test@mail.com',
            password: ''
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql('Bad Request');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('One or more fields were empty.');
            done();
          });
      });
    });
  });

});