const Sequelize = require('sequelize');
const connection = require('../config');

const core = connection.define('core', {
  icon: {
    type: Sequelize.TEXT,
    defaultValue: 'noPic',
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  desc: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
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

module.exports = core;
