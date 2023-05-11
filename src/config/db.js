const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
};

const syncModels = async () => {
  await sequelize.sync();
  console.log('models synchronized with the database');
};

module.exports = { testConnection, syncModels };
