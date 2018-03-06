const express = require('express');
const morgan = require('morgan');

const auth = require('./routes/auth');
const {verifyAuth, ignoreFavicon} = require('./routes/middleware');
const users = require('./routes/user');
const search = require('./routes/search');

const app = express();

// Used for setting up environment variables locally
require('dotenv').config();

// Only use logs when not testing
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Ignore Favicon requests
app.use(ignoreFavicon);

// Login and Register
app.use(auth);

// Authentication Middleware
// All requests after this point require a logged in user
app.use(verifyAuth);

// User routes
app.use('/users', users);

app.use('/search', search);

module.exports = app;