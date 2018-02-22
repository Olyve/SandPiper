const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Authentication Middleware
function verifyAuth(req, res, next) {
  // Get token from Authorization header
  // Header format - Authorization: Bearer [token]
  let authToken = req.get('Authorization').split(' ')[1];

  if (!authToken) {
    return res.status(401).json({
      status: 'Unauthorized',
      messages: [
        'Please check that you are logged in and try again.',
      ]
    });
  }

  // Verify token is valid
  jwt.verify(authToken, process.env.SECRET, (err, token) => {
    // Handle invalid token
    if (err) {
      return res.status(401).json({
        status: 'Unauthorized',
        messages: [
          'Please check that you are logged in and try again.'
        ]
      });
    }

    // Valid token, add token to payload and proceed
    req.user = token;
    next();
  });
}

// Used to ignore the Favicon request
function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    return res.status(204).json({
      status: 'Not Found'
    });
  }
  else {
    // Just continue for any other request
    next();
  }
}

module.exports = {verifyAuth, ignoreFavicon}