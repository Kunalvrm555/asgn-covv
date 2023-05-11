const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // import the Op object from sequelize
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {

    // get the query parameters from the request object
    const { category, page = 1, limit = null, search = '' } = req.query;
    
    // create an options object to use in the Product.findAll method
    const options = {};

    // add a where clause to the options object if a category is provided
    if (category) {
      options.where = { category };
    }
    // extend the where clause if a search term is provided
    if (search) {
      options.where = {
        ...options.where,
        name: {
          [Op.iLike]: `%${search}%`
        }
      };
    }

    // calculate the offset based on the page and limit parameters
    const offset = (page - 1) * limit;

    // query the database for products using the options object
    const products = await Product.findAll({
      ...options,
      limit,
      offset,
    });

    // send the JSON response with the products
    res.json(products);
  } catch (err) {
    // handle errors and send a 500 response with an error message
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// export the router object
module.exports = router;
