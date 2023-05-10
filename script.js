const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
    //fetch user and db details from .env file
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
  );
`;

async function createTable() {
    const client = await pool.connect();

    try {
        // Create the table if it doesn't exist
        await pool.query(createTableQuery);

        await client.query('COMMIT');

        console.log('Table created successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
    } finally {
        client.release();
    }
}

async function insertProducts() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

        // Insert all the products into the table
        for (const product of products) {
            const { name, category, price } = product;
            const query = {
                text: 'INSERT INTO products(name, category, price) VALUES($1, $2, $3)',
                values: [name, category, price],
            };
            await client.query(query);
        }

        await client.query('COMMIT');
        console.log('Products inserted successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
    } finally {
        client.release();
    }
}

createTable().then(() => {
    insertProducts().then(() => {
        pool.end();
    });
});
