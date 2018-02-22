const express = require('express');
const morgan = require('morgan');

const auth = require('./routes/auth');

const app = express();

// Used for setting up environment variables locally
require('dotenv').config();

// Only use logs when not testing
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Login and Register
app.use(auth);

// Authentication Middleware
// All requests after this point require a logged in user

module.exports = app;