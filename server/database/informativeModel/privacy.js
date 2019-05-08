const Sequelize = require('sequelize');
const connection = require('../config');

const privacy = connection.define('privacy', {
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  header_media: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

module.exports = privacy;
