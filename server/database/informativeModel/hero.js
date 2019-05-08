const Sequelize = require('sequelize');
const connection = require('../config');

const hero = connection.define('hero', {
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  cta: {
    type: Sequelize.TEXT,
  },
  image: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  link: {
    type: Sequelize.TEXT,
  },
  body: {
    type: Sequelize.TEXT,
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

module.exports = hero;
