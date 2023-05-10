const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);

module.exports = { sequelize, User, Product };
