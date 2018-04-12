const bodyParser = require('body-parser');
const express = require('express');

const {clientResponse} = require('../utils/client_response');
const logger = require('../utils/logger');
const User = require('../models/user');
const {generateToken} = require('../services/apple');

const router = express.Router();
router.use(bodyParser.json());

router.get('/generateToken', (req, res) => {
  clientResponse(res, 200, ['Returning token.'], { token: generateToken() });
});

module.exports = router;