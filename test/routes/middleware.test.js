// Import required components from common
const {
  chai,
  jwt,
  server,
  User
} = require('../common.js');

describe('Middleware', () => {
  // ============================
  //
  //  Test Verifying a Request
  //  
  // ============================
  
  describe('verifyAuth', () => {
    let token = '';
    let id = '';

    // Setup user in db
    before((done) => {
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
    
    context('token is valid and matches user', () => {
      it('should return success', (done) => {
        // Make request that requires token to verify it
        chai.request(server)
          .get(`/api/users/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('Success');
            res.body.should.have.property('messages');
            res.body.messages.should.contain('Returning found user.');
            done();
          });
      });
    });

    context('token is correctly formatted, but does not match', () => {
      it('should return nothing found', (done) => {
        let user = new User({
          email: 'mail@mail.com',
          password: 'password'
        });

        user.save((err, saved_user) => {
          let alt_token = jwt.sign({ _id: saved_user._id, email: saved_user.email }, process.env.SECRET);

          chai.request(server)
            .get(`/api/users/${id}`)
            .set('Authorization', `Bearer ${alt_token}`)
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
    });

    context('no token is provided', () => {
      it('should return request unauthorized', (done) => {
        chai.request(server)
          .get(`/api/users/${id}`)
          .set('Authorization', 'Bearer ')
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

  // ===============================
  //
  //  Test Ignoring Favicon Requests
  //  
  // ===============================

  describe('ignoreFavicon', () => {
    it('should return no content', (done) => {
      chai.request(server)
        .get('/api/favicon.ico')
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.an('object').that.is.empty;
          done();
        });
    });
  });
});