const Sequelize = require('sequelize');
const connection = require('../config');

const partners = connection.define('partners', {
  name: Sequelize.TEXT,
  image: Sequelize.TEXT,
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

module.exports = partners;
