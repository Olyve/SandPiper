const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');

const router = express.Router();
router.use(bodyParser.json());

// POST /register
router.post('/register', (req, res) => {
  let email = req.body.email;

  // Check whether a user already exists with email
  User.findOne({ email: email }).then((user) => {
    // If user is nil, continue with creation
    if (!user) {
      let user = new User(req.body);

      // Save will attempt to validate properties
      user.save((err, saved_user) => {
        // If validation failed, return reason why
        if (err) {
          var errorMessages = [];
          for (var key in err.errors) {
            errorMessages.push(err.errors[key].message);
          }
          return clientResponse(res, 400, errorMessages);
        }
        else {
          // Success, return proper message
          return clientResponse(res, 201, ['User successfully created.'], {id: saved_user._id});
        }
      });
    }
    else {
      return clientResponse(res, 403, ['A user already exists with that email.']);
    }
  })
    .catch((err) => {
      logger.error(`Find User Error: ${err}`);
      return clientResponse(res, 400);
    });
});

// POST /login
router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // Validate no empty fields
  if (!email || !password) {
    return clientResponse(res, 400, ['One or more fields were empty.']);
  }

  User.findOne({ email: email })
    .select('+password')
    .then((user) => {
      if (!user) {
        // Unable to find user
        return clientResponse(res, 401);
      }

      // Check that password matches
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          // Log internal error to console
          logger.error(`Internal Error: ${err}`);
          return clientResponse(res, 500);
        }

        // Validate credentials
        if (isMatch) {
          // Generate JWT token and return it
          let token = jwt.sign({ _id: user._id, email: user.email}, process.env.SECRET);

          res.status(200).json({
            status: 'Success',
            messages: [
              'User successfully logged in.'
            ],
            data: {
              token: token,
              user_id: user._id
            }
          });
        }
        else {
          // Password did not match aka. Invalid Credentials.
          return clientResponse(res, 401);
        }
      });
    });
});

module.exports = router;