const express = require('express');
const productsRouter = require('./products');
const enquiriesRouter = require('./enquiries');

const router = express.Router();
router.use('/products', productsRouter);
router.use('/enquiries', enquiriesRouter);

module.exports = router;
