// routes/enquiries.js
const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries } = require('../controllers/enquiriesController');

router.post('/', createEnquiry);
router.get('/', getEnquiries);

module.exports = router;
