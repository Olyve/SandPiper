const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {isEmail} = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  spotifyToken: { type: String },
  spotifyRefreshToken: { type: String },
  spotifyID: { type: String },
  appleDevToken: { type: String },
  appleMusicToken: { type: String },
  appleMusicCountryCode: { type: String },
  active: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password is too short.'],
    select: false
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return isEmail(v);
      },
      message: 'Not a valid email address.'
    }
  },
});

// Updated/Created
UserSchema.pre('save', function(next) {
  let now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  let user = this;
  if (!user.isModified('password')) {
    return next();
  }

  // Salting
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

// Comapring the password as a method
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);