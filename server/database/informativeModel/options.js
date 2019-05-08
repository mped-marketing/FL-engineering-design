const Sequelize = require('sequelize');
const connection = require('../config');

const options = connection.define('options', {
  facebook: {
    type: Sequelize.TEXT,
  },
  contact: {
    type: Sequelize.TEXT,
  },
  twitter: {
    type: Sequelize.TEXT,
  },
  whats: Sequelize.TEXT,
  google: Sequelize.TEXT,
  logo: {
    type: Sequelize.TEXT,
  },
  youtube: Sequelize.TEXT,
  instagram: Sequelize.TEXT,
  address: Sequelize.TEXT,
  second_logo: {
    type: Sequelize.TEXT,
  },
  copyrights: {
    type: Sequelize.TEXT,
  },
  facebook_number: {
    allowNull: false,
    defaultValue: 0,
    type: Sequelize.TEXT,
  },
  footer_description: Sequelize.TEXT,
  email: Sequelize.TEXT,
  about_title: Sequelize.TEXT,
  about_desc: Sequelize.TEXT,
  about_story: Sequelize.TEXT,
  about_story_desc: Sequelize.TEXT,
  twitter_number: {
    allowNull: false,
    defaultValue: 0,
    type: Sequelize.TEXT,
  },
  instagram_number: {
    allowNull: false,
    defaultValue: 0,
    type: Sequelize.TEXT,
  },
  sound_number: {
    allowNull: false,
    defaultValue: 0,
    type: Sequelize.TEXT,
  },
  snap_number: {
    allowNull: false,
    defaultValue: 0,
    type: Sequelize.TEXT,
  },
  youtub_number: {
    allowNull: false,
    defaultValue: 0,
    type: Sequelize.TEXT,
  },
  mobile: Sequelize.TEXT,
  type: Sequelize.TEXT,
  favicon: Sequelize.TEXT,
  footer_logo: Sequelize.TEXT,
  latitude: Sequelize.DECIMAL,
  longitude: Sequelize.DECIMAL,
  color: Sequelize.TEXT,
  phone: Sequelize.TEXT,
  tel: Sequelize.TEXT,
  fax: Sequelize.TEXT,
  linkedin: Sequelize.TEXT,
  googleplay: Sequelize.TEXT,
  appstore: Sequelize.TEXT,
  footer_mobile: Sequelize.TEXT,
  footer_email: Sequelize.TEXT,
  footer_address: Sequelize.TEXT,
  footer_phone: Sequelize.TEXT,
  name: Sequelize.TEXT,
  header: Sequelize.TEXT,
  footer: Sequelize.TEXT,
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
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

module.exports = options;
