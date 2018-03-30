const express = require('express');
const morgan = require('morgan');
const app = express();
const api = require('./routes/api');

// Used for setting up environment variables locally
require('dotenv').config();

// Only use logs when not testing
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Setup static folder and return frontend on GET root
app.use(express.static(__dirname + '/public/build'));
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
    .sendFile('/index.html');
});

// Setup API routing
app.use('/api', api);

module.exports = app;