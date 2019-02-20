const mongoose = require('mongoose');


const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  logging: false,
  dialectOptions: {
    ssl: true,
  }
});


module.exports = sequelize;