const Sequelize = require('sequelize');
const connection = require('../config');

const newsletters = connection.define('newsletters', {
  email: Sequelize.TEXT,
});

module.exports = newsletters;
