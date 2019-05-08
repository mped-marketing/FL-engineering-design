const Sequelize = require('sequelize');
const connection = require('../config');

const posts = connection.define('posts', {
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  header_media: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  post_intro: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  seo: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
  },
  createdAt: {
    allowNull: false,
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE,
  },
  approve: Sequelize.BOOLEAN,
  updatedAt: {
    allowNull: false,
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE,
  },
});

module.exports = posts;
