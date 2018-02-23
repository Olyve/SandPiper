process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const db_connect = require('../utils/db');
const server = require('../app');
const User = require('../models/user');

const should = chai.should();

chai.use(chaiHttp);

module.exports = {
  chai,
  chaiHttp,
  db_connect,
  server,
  User,
  should,
  jwt
};