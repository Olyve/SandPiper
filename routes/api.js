const express = require('express');
const router = express.Router();

const apple = require('./apple');
const auth = require('./auth');
const migrate = require('./migrate');
const spotify = require('./spotify');
const users = require('./user');
const { verifyAuth, ignoreFavicon, allowCORS } = require('./middleware');

// Ignore Favicon requests
router.use(ignoreFavicon);

// Allow CORS requests
router.use(allowCORS);

// Login and Register
router.use(auth);

// Authentication Middleware
// All requests after this point require a logged in user
router.use(verifyAuth);

// Resource Routes
router.use('/users', users);
router.use('/spotify', spotify);
router.use('/apple', apple);

// Migrations
router.use(migrate);

module.exports = router;