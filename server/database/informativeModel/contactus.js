const Sequelize = require('sequelize');
const connection = require('../config');

const contactus = connection.define('contactus', {
  name: Sequelize.TEXT,
  email: Sequelize.TEXT,
  mobile: Sequelize.TEXT,
  message: Sequelize.TEXT,
});

module.exports = contactus;
