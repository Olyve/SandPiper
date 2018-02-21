const express = require('express');
const morgan = require('morgan');
const app = express();

// Used for setting up environment variables locally
require('dotenv').config();

// Only use logs when not testing
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

module.exports = app;