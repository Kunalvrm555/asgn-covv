const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, page = 1, limit = null, search = '' } = req.query;
    const options = category ? { where: { category } } : {};
    if (search) {
      options.where = {
        ...options.where,
        name: {
          [Op.iLike]: `%${search}%`
        }
      };
    }
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
