const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
    await Product.sync({ force: true });
    console.log('Product model synchronized with the database');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
}

async function insertProducts() {
  try {
    const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
    await Product.bulkCreate(products);
    console.log('Products inserted successfully!');
  } catch (err) {
    console.error('Error inserting products:', err);
  } finally {
    await sequelize.close();
  }
}

syncDatabase().then(() => {
  insertProducts();
});
