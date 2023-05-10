const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { Sequelize, Op } = require('sequelize');

const app = express();
const port = 3000;
app.use(bodyParser.json());

// create sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

// test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
})();

// create Product model
const Product = sequelize.define('Product', {
  name: Sequelize.STRING,
  category: Sequelize.STRING,
  price: Sequelize.INTEGER
});

// synchronize the model with the database
(async () => {
  await sequelize.sync();
  console.log('Product model synchronized with the database');
})();

app.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    const options = category ? { where: { category } } : {};

    const products = await Product.findAll(options);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
      ]
    });
    res.send(categories.map(c => c.category));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
