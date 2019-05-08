const Sequelize = require('sequelize');
const connection = require('../config');

const statistics = connection.define('statistics', {
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  count: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  type: Sequelize.TEXT,
  createdAt: {
    allowNull: false,
    defaultValue: new Date(),
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    defaultValue: new Date(),
    type: Sequelize.DATE,
  },

});

module.exports = statistics;
