// Import required components from common
const {
  chai,
  jwt,
  nock,
  server,
  User
} = require('../common');

describe('Spotify Routes', () => {
  let token = '';
  let bad_token = jwt.sign({ _id: '5a9da3732f0b196608416ae3', email: '' }, process.env.SECRET);

  // Test setup
  before((done) => {
    // Setup user
    let user = new User({
      email: 'user@mail.com',
      password: 'password',
      spotifyID: 1
    });

    user.save((err, saved_user) => {
      token = jwt.sign({ _id: saved_user._id, email: saved_user.email }, process.env.SECRET);
      done();
    });
  });

  // =======================
  //
  //  Test Search Spotify
  //  
  // =======================
  
  describe('GET /api/spotify/search', () => {
    before((done) => {
      nock('https://api.spotify.com/v1')
        .get('/search')
        .query((query) => {
          return query.q === 'search';
        })
        .reply(200, 'results');
      done();
    });

    it('should return results from API', (done) => {
      chai.request(server)
        .get('/api/spotify/search')
        .query({search_term: 'search'})
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('messages');
          res.body.messages.should.contain('Returning search results.');
          res.body.should.have.property('data');
          res.body.data.should.have.property('results');
          // Placeholder data since we are testing route not actual service
          res.body.data.results.should.eql('results');
          done();
        });
    });

    context('search_term is empty or undefined', () => {
      it('should return bad request', (done) => {
        chai.request(server)
          .get('/api/spotify/search')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql('Bad Request');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('Request failed, please try again.');
            done();
          });
      });
    });

    context('user is not found', () => {
      it('should return unauthorized', (done) => {
        chai.request(server)
          .get('/api/spotify/search')
          .query({search_term: 'bad_user'})
          .set('Authorization', `Bearer ${bad_token}`)
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

  // =======================
  //
  //  Test Get Playlists
  //  
  // =======================
  
  describe('GET /api/spotify/playlists', () => {
    before((done) => {
      nock('https://api.spotify.com/v1')
        .get('/me/playlists')
        .reply(200, 'playlists');
      done();
    });

    it('should return the user\'s playlists', (done) => {
      chai.request(server)
        .get('/api/spotify/playlists')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('messages');
          res.body.messages.should.contain('Returning user\'s playlists.');
          res.body.should.have.property('data');
          res.body.data.should.have.property('results');
          // Placeholder data as we are just testing the route here
          res.body.data.results.should.eql('playlists');
          done();
        });
    });

    context('the user is not found', () => {
      it('should return unauthorized', (done) => {
        chai.request(server)
          .get('/api/spotify/playlists')
          .set('Authorization', `Bearer ${bad_token}`)
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

  // =============================
  //
  //  Test Get a Specific Playlist
  //  
  // =============================
  
  describe('GET /api/playlist', () => {
    before((done) => {
      nock('https://api.spotify.com/v1')
        .get('/users/1/playlists/1')
        .reply(200, 'results');
      done();
    });

    it('should return the playlist info', (done) => {
      chai.request(server)
        .get('/api/spotify/playlist')
        .set('Authorization', `Bearer ${token}`)
        .send({url: 'https://api.spotify.com/v1/users/1/playlists/1'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('messages');
          res.body.messages.should.contain('Returning playlist.');
          res.body.should.have.property('data');
          res.body.data.should.have.property('results');
          res.body.data.results.should.eql('results');
          done();
        });
    });

    context('the user is not found', () => {
      it('should return unauthorized', (done) => {
        chai.request(server)
          .get('/api/spotify/playlists/1')
          .set('Authorization', `Bearer ${bad_token}`)
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

});