const bodyParser = require('body-parser');
const express = require('express');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');

const router = express.Router();
router.use(bodyParser.json());

// GET /:id
router.get('/:id', (req, res) => {
  // If not authorized to make request, return 404
  if (!isAuthorized(req)) {
    return clientResponse(res, 404);
  }

  User.findById(req.params.id, (err, user) => {
    if (err) {
      // Log error to console and return 400
      logger.error(`Find User Error: ${err}`);
      return clientResponse(res, 400);
    }

    // No user exists with that id
    // We return 401 to ensure we don't leak information
    if (!user) { return clientResponse(res, 401); }

    // Proceed to return the User
    return clientResponse(res, 200, ['Returning found user.'], user);
  });
});

// PUT /:id
router.put('/:id', (req, res) => {
  // If not authorized to make request, return 404
  if (!isAuthorized(req)) {
    return clientResponse(res, 404);
  }

  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    if (err) {
      // Log error to console and return 400
      logger.error(`Find User and Update Error: ${err}`);
      return clientResponse(res, 400);
    }

    // No user exists with that id, return 401
    if (!user) { return clientResponse(res, 401); }

    // Everything worked, return the updated user
    return clientResponse(res, 200, ['User updated successfully.'], user);
  });
});

// Verifies user is allowed to make request
function isAuthorized(req) {
  return req.params.id == req.user._id;
}

module.exports = router;