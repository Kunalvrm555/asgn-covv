const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function initDB() {
    try {
        // Drop database if exists
        await sequelize.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME};`);
        // Create database
        await sequelize.query(`CREATE DATABASE ${process.env.DB_NAME};`);
        console.log('Database created successfully.');

        // Connect to database
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');


        // Sync models with database
        const models = require('../models');
        await models.sequelize.sync({ force: true });

        // Insert seed data
        const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
        await models.Product.bulkCreate(products);
        console.log('Products inserted successfully!');

        const bcrypt = require('bcrypt');
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);
        await models.User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: adminPassword
        });
        console.log(`User created successfully!`);

        console.log('Tables initialized successfully.');
    } catch (error) {
        console.error('Unable to initialize database:', error);
    } finally {
        await sequelize.close();
    }
}

initDB();
