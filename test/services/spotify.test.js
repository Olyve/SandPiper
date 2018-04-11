// Import required components from Common
const {
  nock,
  User
} = require('../common');
const SpotifyService = require('../../services/spotify');

describe('Spotify Service', () => {

  // ============================
  //
  //  Test Access Token Calls
  //  
  // ============================

  describe('getAuthToken', () => {
    context('a valid authorization code is provided', () => {
      it('should return an access_token and refresh_token', (done) => {
        nock('https://accounts.spotify.com/api')
          .post('/token', (body) => {
            return body.code === 'valid_code';
          })
          .reply(200, {
            'access_token': 'NgCXRKMzYjw',
            'token_type': 'Bearer',
            'scope': 'user-read-private user-read-email',
            'expires_in': 3600,
            'refresh_token': 'NgAagAUm_SHo'
          });

        SpotifyService.getAuthToken('valid_code', 'redirect')
          .then((json) => {
            json.should.have.property('access_token').eql('NgCXRKMzYjw');
            json.should.have.property('token_type').eql('Bearer');
            json.should.have.property('scope').eql('user-read-private user-read-email');
            json.should.have.property('expires_in').eql(3600);
            json.should.have.property('refresh_token').eql('NgAagAUm_SHo');
            done();
          });
      });
    });
  });

  describe('refreshAuthToken', () => {
    before((done) => {
      nock('https://accounts.spotify.com/api')
        .post('/token', {
          grant_type: 'refresh_token',
          refresh_token: 'NgAagAUm_SHo'
        })
        .reply(200, {
          'access_token': 'NgA6ZcYIixn8bUQ',
          'token_type': 'Bearer',
          'scope': 'user-read-private user-read-email',
          'expires_in': 3600
        });
      done();
    });

    context('a valid refresh_token is provided', () => {
      it('should return a new access_token', (done) => {
        SpotifyService.refreshAuthToken('NgAagAUm_SHo')
          .then((json) => {
            json.should.have.property('access_token').eql('NgA6ZcYIixn8bUQ');
            json.should.have.property('token_type').eql('Bearer');
            json.should.have.property('scope').eql('user-read-private user-read-email');
            json.should.have.property('expires_in').eql(3600);
            done();
          });
      });
    });
  });

  describe('handleExpiredToken', () => {
    context('wrapped function returns 401', () => {
      it('should call refresh the access token', (done) => {
        // Setup mock requests
        nock('https://api.spotify.com/v1')
          .get('/search')
          .query(true)
          .reply(401, {statusCode: 401})
          .get('/search')
          .query(true)
          .reply(200, { message: 'Request succeeded second time.' });

        nock('https://accounts.spotify.com/api')
          .post('/token', (body) => {
            return body.refresh_token === 'refresh_token';
          })
          .reply(200, {
            'access_token': 'NgA6ZcYIixn8bUQ',
            'token_type': 'Bearer',
            'scope': 'user-read-private user-read-email',
            'expires_in': 3600
          });

        // Setup mock user
        let user = new User({
          email: 'mail@user.com',
          password: 'password',
          spotifyToken: '',
          spotifyRefreshToken: 'refresh_token'
        });

        user.save((err, saved_user) => {
          SpotifyService.search(saved_user, 'search')
            .then((json) => {
              json.message.should.eql('Request succeeded second time.');
              done();
            });
        });
      });
    });

    context('if an access token is not returned', () => {
      it('should return an error', (done) => {
        // Setup mock requests
        nock('https://api.spotify.com/v1')
          .get('/search')
          .query(true)
          .twice()
          .reply(401, {statusCode: 401});

        nock('https://accounts.spotify.com/api')
          .post('/token', (body) => {
            return body.refresh_token === 'nothing';
          })
          .twice()
          .replyWithError('Invalid refresh token');

        let user = new User({
          email: 'mail@user.com',
          password: 'password',
          spotifyToken: '',
          spotifyRefreshToken: 'nothing'
        });

        user.save((err, saved_user) => {
          SpotifyService.search(saved_user, 'search')
            .catch((err) => {
              err.message.should.eql('Error: Invalid refresh token');
              done();
            });
        });
      });
    });
  });

});