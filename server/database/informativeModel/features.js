const Sequelize = require('sequelize');
const connection = require('../config');

const features = connection.define('features', {
  image: {
    type: Sequelize.TEXT,
  },
  icon: {
    type: Sequelize.TEXT,
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  homepage: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  body: {
    type: Sequelize.TEXT,
  },
  desc: {
    type: Sequelize.TEXT,
  },
  sub_title: {
    type: Sequelize.TEXT,
  },
  cta: Sequelize.TEXT,
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

module.exports = features;
