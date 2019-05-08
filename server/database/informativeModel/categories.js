const Sequelize = require('sequelize');
const connection = require('../config');

const categories = connection.define('categories', {
  image: {
    type: Sequelize.TEXT,
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  sub_title: {
    type: Sequelize.TEXT,
  },
  cta: Sequelize.TEXT,
  body: {
    type: Sequelize.TEXT,
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

module.exports = categories;
