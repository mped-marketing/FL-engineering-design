const Sequelize = require('sequelize');
const connection = require('../config');

const aboutItem = connection.define('aboutItem', {
  image: {
    type: Sequelize.TEXT,
    defaultValue: 'noPic',
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
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

module.exports = aboutItem;
