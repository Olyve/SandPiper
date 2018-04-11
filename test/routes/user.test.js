// Import required components from common
const {
  chai,
  nock,
  server,
  should,
  User,
  jwt
} = require('../common');

describe('User Routes', () => {
  let token = '';
  let id = '';
  const alt_token = jwt.sign({ _id: '5a9da3732f0b196608416ae3', email: '' }, process.env.SECRET);

  before((done) => {
    // Setup user in db
    let user = new User({
      email: 'user@mail.com',
      password: 'password'
    });

    user.save((err, saved_user) => {
      token = jwt.sign({ _id: saved_user._id, email: saved_user.email }, process.env.SECRET);
      id = saved_user._id;
      done();
    });
  });

  // Test clean up
  after((done) => {
    nock.enableNetConnect();
    nock.cleanAll();
    done();
  });

  // ============================
  //
  //  Test Fetching a User
  //  
  // ============================
  
  describe('GET /api/users/:id', () => {
    context('user is authorized and id is valid', () => {
      it('should return the user', (done) => {
        chai.request(server)
          .get(`/api/users/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('Success');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('Returning found user.');
            res.body.should.have.property('data');
            res.body.data.should.have.property('_id').eql(`${id}`);
            done();
          });
      });
    });

    context('user\'s id does not match the route id', () => {
      it('should return not found', (done) => {
        chai.request(server)
          .get('/api/users/5a9da3732f0b122608416ae3')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('status').eql('Not Found');
            res.body.should.have.property('messages');
            // eslint-disable-next-line no-useless-escape
            res.body.messages.should.contain('Nothing to see here ¯\_(ツ)_/¯.'); 
            done();
          });
      });
    });

    context('there is no user with the provided id', () => {
      it('should return 401', (done) => {
        chai.request(server)
          .get('/api/users/5a9da3732f0b196608416ae3')
          .set('Authorization', `Bearer ${alt_token}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').eql('Unauthorized');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('Please check credentials and try again.');
            done();
          });
      });
    });

  });

  // ============================
  //
  //  Test Updating a User
  //  
  // ============================
  
  describe('PUT /api/users/:id', () => {

    context('authorized and properties are valid', () => {
      it('should update user', (done) => {
        chai.request(server)
          .put(`/api/users/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .send({
            spotifyToken: 'spotify-token',
            appleMusicToken: 'apple-token'
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('Success');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('User updated successfully.');
            done(err);
          });
      });
    });

    context('user\'s id does not match the route id', () => {
      it('should return not found', (done) => {
        chai.request(server)
          .put('/api/users/5a9da3732f0b122608416ae3')
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .send({
            spotifyToken: 'spotify-token',
            appleMusicToken: 'apple-token'
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('status').eql('Not Found');
            res.body.should.have.property('messages');
            // eslint-disable-next-line no-useless-escape
            res.body.messages.should.contain('Nothing to see here ¯\_(ツ)_/¯.'); 
            done();
          });
      });
    });

    context('there is no user with the provided id', () => {
      it('should return 401', (done) => {
        chai.request(server)
          .put('/api/users/5a9da3732f0b196608416ae3')
          .set('Authorization', `Bearer ${alt_token}`)
          .set('Content-Type', 'application/json')
          .send({
            spotifyToken: 'spotify-token',
            appleMusicToken: 'apple-token'
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

  });

  // ===================================
  //
  //  Test Updating a User's Auth Tokens
  //  
  // ===================================
  
  describe('POST /api/users/:id/spotifyAuth', () => {
    before((done) => {
      nock('https://accounts.spotify.com/api')
        .post('/token', (body) => {
          return body.code === 'auth_code';
        })
        .reply(200, {
          access_token: 'a_token',
          refresh_token: 'r_token'
        })
        .post('/token', (body) => {
          return body.code === 'bad_code';
        })
        .reply(400, 'Auth code expired');

      nock('https://api.spotify.com/v1')
        .get('/me')
        .reply(200, {
          user_id: 'spotify_user_id'
        });
      done();
    });

    context('a correct request is made', () => {
      it('should update user', (done) => {
        chai.request(server)
          .post(`/api/users/${id}/spotifyAuth`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .send({
            code: 'auth_code',
            redirect_uri: 'redirect_uri'
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('Success');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('User updated successfully.');
            done();
          });
      });
    });

    context('Spotify token request fails', () => {
      it('should return bad request', (done) => {
        chai.request(server)
          .post(`/api/users/${id}/spotifyAuth`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .send({
            code: 'bad_code',
            redirect_uri: 'redirect_uri'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql('Bad Request');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('Unable to get auth token.');
            done();
          });
      });
    });

  });

});