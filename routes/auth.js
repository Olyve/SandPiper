const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const router = express.Router();
const User = require('../models/user');

router.use(bodyParser.json());

// POST /register
router.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // Check whether a user already exists with email
  User.findOne({ email: email }).then((user) => {
    // If user is nil, continue with creation
    if (!user) {
      let user = new User(req.body);

      // Save will attempt to validate properties
      user.save((err) => {
        // If validation failed, return reason why
        if (err) {
          errorMessages = [];
          for (var key in err.errors) {
            errorMessages.push(err.errors[key].message);
          }
          res.status(400).json({
            status: 'Failed',
            messages: errorMessages
          });
        }
        else {
          // Success, return proper message
          res.status(201).json({
            status: 'Success',
            messages: 'User successfully created.'
          });
        }
      });
    }
    else {
      res.status(403).json({
        status: 'Forbidden',
        messages: 'A user already exists with that email.'
      });
    }
  })
  .catch((err) => {
    logger.error(`Find User Error: ${err}`);
    res.status(400).json({
      status: 'Failed',
      messages: 'Something went wrong, please try again.'
    });
  });
});

// POST /login
router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // Validate no empty fields
  if (!email || !password) {
    return res.status(400).json({
      status: 'Bad Request',
      messages: [
        'One or more fields were empty.'
      ]
    });
  }

  User.findOne({
    email: email
  })
  .select('+password')
  .then((user) => {
    if (!user) {
      // Unable to find user
      return unauthorizedRequest(res);
    }

    // Check that password matches
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        // Log internal error to console
        logger.error(`Internal Error: ${err}`);

        res.status(500).json({
          status: 'Internal Server Error',
          messages: [
            'Apologies, something seems to have gone wrong. Please try again.'
          ]
        });
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
        unauthorizedRequest(res);
      }
    });
  });
});

// Helpers
function unauthorizedRequest(res) {
  return res.status(401).json({
    status: 'Unauthorized',
    messages: [
      'Please check credentials and try again.'
    ]
  });
}

module.exports = router;