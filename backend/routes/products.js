const express = require('express');
const { getProducts, getProductById } = require('../controllers/productsController');
const router = express.Router();

router.get('/', getProducts);           // /api/products
router.get('/:id', getProductById);    // /api/products/1

module.exports = router;
