const Sequelize = require('sequelize');
const connection = require('../config');

const services = connection.define('services', {
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
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  seo: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
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

module.exports = services;
