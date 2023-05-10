const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { sequelize, Product } = require('./models');
const { testConnection, syncModels } = require('./db');
const app = express();
const port = 3000;
app.use(bodyParser.json());

testConnection(); // test connection to database
syncModels(); // sync models to database

app.get('/products', async (req, res) => {
  try {
    const { category, page = 1, limit = 5 } = req.query;
    const options = category ? { where: { category } } : {};
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      ...options,
      limit,
      offset,
    });
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
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ]
    });
    res.send(categories.map(c => c.category));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
