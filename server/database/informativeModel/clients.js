const Sequelize = require('sequelize');
const connection = require('../config');

const clients = connection.define('clients', {
  name: Sequelize.TEXT,
  jobTitle: Sequelize.TEXT,
  image: Sequelize.TEXT,
  description: Sequelize.TEXT,
  facebook: Sequelize.TEXT,
  linkedin: Sequelize.TEXT,
  twitter: Sequelize.TEXT,
  createdAt: {
    allowNull: false,
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE,
  },
});

module.exports = clients;
