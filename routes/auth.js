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

module.exports = router;