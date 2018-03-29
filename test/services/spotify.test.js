// Import required components from Common
const {
  chai,
  nock
} = require('../common');
const SpotifyService = require('../../services/spotify');
const rp = require('request-promise-native');
const sinon = require('sinon');

describe('Spotify Service', () => {

  before((done) => {
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
      })
      .post('/token', {
        grant_type: 'refresh_token',
        refresh_token: 'NgAagAUm_SHo'
      })
      .reply(200, {
        'access_token': 'NgA6ZcYIixn8bUQ',
        'token_type': 'Bearer',
        'scope': 'user-read-private user-read-email',
        'expires_in': 3600
      })
      .post('/token', (body) => {
        console.log(body);
        return body.refresh_token === 'refresh';
      })
      .reply(200, {
        'access_token': 'NgA6ZcYIixn8bUQ',
        'token_type': 'Bearer',
        'scope': 'user-read-private user-read-email',
        'expires_in': 3600
      });

    done();
  });

  // ============================
  //
  //  Test Access Token Calls
  //  
  // ============================

  describe('getAuthToken', () => {
    context('should return an access_token and refresh_token', () => {
      it('when a valid authorization code is provided', (done) => {
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
    context('should return a new access_token', () => {
      it('when a valid refresh_token is provided', (done) => {
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

  // describe('handleExpiredToken', () => {
  //   context('should call refreshAuthToken', () => {
  //     it('when wrapped function returns 401', (done) => {
  //       var scope = nock('http://localhost:3000')
  //         .post('/')
  //         .reply(function(url, body, callback) {
  //           this.req.emit('error', 'Token Expired.');
  //         })
  //         .post('/')
  //         .reply(200, { message: 'Request succeeded second time.' });

  //       const test_func = SpotifyService.handleExpiredToken(function(user) {
  //         return rp.post({
  //           url: 'http://localhost:3000',
  //           form: user,
  //           json: true,
  //           simple: false
  //         });
  //       });

  //       const spy = sinon.spy(test_func);

  //       spy.then((res) => {
  //         console.log(res);
  //         done();
  //       });
  //     });
  //   });
  // });

});