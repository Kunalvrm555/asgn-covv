const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { sequelize, Product } = require('./models');
const { testConnection, syncModels } = require('./db');
const app = express();
const port = 3000;
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
app.use(bodyParser.json());
testConnection(); // test connection to database
syncModels(); // sync models to database

app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

app.listen(port, () => console.log(`app listening on port ${port}!`));
