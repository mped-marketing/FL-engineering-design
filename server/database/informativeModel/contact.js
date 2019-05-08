const Sequelize = require('sequelize');
const connection = require('../config');

const contact = connection.define('contact', {
  image: {
    type: Sequelize.TEXT,
    defaultValue: 'noPic',
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  quote: {
    type: Sequelize.TEXT,
  },
  sub_title: {
    type: Sequelize.TEXT,
  },
  office: {
    type: Sequelize.TEXT,
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
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

module.exports = contact;
