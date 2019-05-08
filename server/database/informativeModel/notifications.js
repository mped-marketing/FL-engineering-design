const Sequelize = require('sequelize');
const connection = require('../config');

const notifications = connection.define('notifications', {
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  seen: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
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

module.exports = notifications;
