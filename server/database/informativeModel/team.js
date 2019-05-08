const Sequelize = require('sequelize');
const connection = require('../config');

const team = connection.define('team', {
  name: Sequelize.TEXT,
  image: Sequelize.TEXT,
  facebook: Sequelize.TEXT,
  twitter: Sequelize.TEXT,
  youtube: Sequelize.TEXT,
  instagram: Sequelize.TEXT,
  title: Sequelize.TEXT,
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

module.exports = team;
