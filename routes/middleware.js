const jwt = require('jsonwebtoken');
const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');

// Authentication Middleware
function verifyAuth(req, res, next) {
  // If it is a pre-flight CORS request, don't require Auth
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Don't need auth for public files
  if (req.path.substring(0, 7) === '/public') {
    return next();
  }

  // Get token from Authorization header
  // Header format - Authorization: Bearer [token]
  var authToken = '';

  if (req.get('Authorization') === undefined) {
    return clientResponse(res, 401);
  } else {
    authToken = req.get('Authorization').split(' ')[1];
  }

  // Verify token is valid
  jwt.verify(authToken, process.env.SECRET, (err, token) => {
    // Handle invalid token
    if (err) {
      logger.error(`Verify Token Error: ${err}`);
      return clientResponse(res, 401);
    }

    // Valid token, add token to payload and proceed
    req.user = token;
    next();
  });
}

// Used to ignore the Favicon request
function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/api/favicon.ico') {
    return res.status(204).json({
      status: 'Not Found'
    });
  } else {
    next(); // Just continue for any other request
  }
}

// Used to enable CORS
function allowCORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // If this is a preflight check, return okay with acceptable options
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}

const isAuthorized = (req, res, next, id) => {
  if (id !== req.user._id) {
    return clientResponse(res, 404);
  }

  next();
};

module.exports = {
  verifyAuth,
  ignoreFavicon,
  allowCORS,
  isAuthorized
};