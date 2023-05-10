const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 3000;
app.use(bodyParser.json());
const pool = new Pool({
    //fetch user and db details from .env file
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
});

//test the database connection
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to the database');
    }
});

app.get('/products', async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM products';

        if (category) {
            query = `SELECT * FROM products WHERE category = '${category}'`;
        }

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
app.get('/categories', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT DISTINCT category FROM products');
        res.send(rows.map(row => row.category));
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
