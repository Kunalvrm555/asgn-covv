const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { testConnection, syncModels } = require('./src/config/db');
const app = express();
const port = 3000;
const authRoutes = require('./src/routes/auth');
const productsRouter = require('./src/routes/products');
const categoriesRouter = require('./src/routes/categories');
app.use(bodyParser.json());
testConnection(); // test connection to database
syncModels(); // sync models to database

app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/auth', authRoutes);
app.listen(port, () => console.log(`app listening on port ${port}!`));
