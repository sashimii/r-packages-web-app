const mongoose = require('mongoose');
require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  logging: false,
  dialectOptions: {
    ssl: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 20000,
    acquire: 20000
  }
});


module.exports = sequelize;