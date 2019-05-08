const Sequelize = require('sequelize');
const connection = require('../config');

const plans = connection.define('plans', {

  price: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  interval: {
    type: Sequelize.TEXT,
  },
  cta: {
    type: Sequelize.TEXT,
  },
  primary: {
    type: Sequelize.BOOLEAN,
  },
  fetures: {
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

module.exports = plans;
