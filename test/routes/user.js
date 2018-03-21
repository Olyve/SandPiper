// Import required components from common
const {
  chai,
  server,
  should,
  User,
  jwt
} = require('../common');

describe('User Routes', () => {
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

  // ============================
  //
  //  Test Fetching a User
  //  
  // ============================
  
  describe('GET /users/:id', () => {
    context('should return the user', () => {
      it('when the user is authorized and id is valid', (done) => {
        chai.request(server)
          .get(`/users/${id}`)
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

    context('should return not found', () => {
      it('when the user\'s id does not match the route id', (done) => {
        chai.request(server)
          .get('/users/5a9da3732f0b122608416ae3')
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

  });

  // ============================
  //
  //  Test Updating a User
  //  
  // ============================
  
  describe('PUT /users/:id', () => {

    context('should update user', () => {
      it('when authorized and properties are valid', (done) => {
        chai.request(server)
          .put(`/users/${id}`)
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

    context('should return not found', () => {
      it('when the user\'s id does not match the route id', (done) => {
        chai.request(server)
          .put('/users/5a9da3732f0b122608416ae3')
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

  });

});