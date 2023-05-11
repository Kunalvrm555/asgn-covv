const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { testConnection, syncModels } = require('./src/config/db');
const app = express();
const port = 3000;

// import routes
const authRoutes = require('./src/routes/auth');
const productsRouter = require('./src/routes/products');
const categoriesRouter = require('./src/routes/categories');

testConnection(); // test connection to database
syncModels(); // sync models to database

// Middleware
app.use(bodyParser.json());

app.use('/products', productsRouter);   // use products router
app.use('/categories', categoriesRouter);   // use categories router
app.use('/auth', authRoutes);   // use auth router for login and register

// Start server on port = 3000
app.listen(port, () => console.log(`app listening on port ${port}!`));
