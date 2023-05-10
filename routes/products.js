const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
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

module.exports = router;
