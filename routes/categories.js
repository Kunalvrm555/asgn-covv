const express = require('express');
const router = express.Router();
const { sequelize, Product } = require('../models');

router.get('/', async (req, res) => {
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

module.exports = router;
