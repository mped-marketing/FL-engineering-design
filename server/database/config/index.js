const Sequelize = require('sequelize');
require('env2')('./config.env');
const { DB_CONFIG } = require('../../../config.js');

const {
  username,
  password,
  dbname,
  host,
  dialect,
} = DB_CONFIG;

module.exports = new Sequelize(dbname, username, password, {
  host,
  dialect,
  operatorsAliases: {
    $like: Sequelize.Op.like,
    $contains: Sequelize.Op.contains,
    $and: Sequelize.Op.and,
    $or: Sequelize.Op.or,
    $in: Sequelize.Op.in,
  },
  logging: false,
  define: {
    timestamps: true,
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
