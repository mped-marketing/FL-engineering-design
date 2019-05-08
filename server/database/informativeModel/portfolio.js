const Sequelize = require('sequelize');
const connection = require('../config');

const porfolio = connection.define('porfolio', {
  title: {
    type: Sequelize.TEXT,
  },
  year: {
    type: Sequelize.TEXT,
  },
  image: {
    type: Sequelize.TEXT,
  },
  body: {
    type: Sequelize.TEXT,
  },
  client: {
    type: Sequelize.TEXT,
  },
  date: {
    type: Sequelize.TEXT,
  },
  location: {
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

module.exports = porfolio;
