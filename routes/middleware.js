const jwt = require('jsonwebtoken');
const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');

// Authentication Middleware
function verifyAuth(req, res, next) {
  // If it is a pre-flight CORS request, don't require Auth
  if (req.method === 'OPTIONS') {
    return next();
  }
  // Get token from Authorization header
  // Header format - Authorization: Bearer [token]
  let authToken = req.get('Authorization').split(' ')[1];

  if (!authToken) {
    return clientResponse(res, 401);
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

module.exports = {verifyAuth, ignoreFavicon, allowCORS};