const db = require('../db/connection');
const emailService = require('../services/emailService');
const { enquiryValidation } = require('../middleware/validation');

// ✅ Helper for INSERT (returns lastID)
function runAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

// ✅ Helper for SELECT * (returns array)
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function(err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

const createEnquiry = async (req, res) => {
  try {
    const { error } = enquiryValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { product_id, name, email, phone, message } = req.body;

    const lastID = await runAsync(
      'INSERT INTO enquiries (product_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [product_id, name, email, phone, message]
    );

    await emailService.sendEnquiryNotification({
      id: lastID,
      name,
      email,
      product_id,
    });

    res.status(201).json({
      success: true,
      id: lastID,
      message: 'Enquiry submitted successfully',
    });
  } catch (error) {
    console.error('createEnquiry error:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await allAsync(`
      SELECT e.*, p.name as product_name 
      FROM enquiries e 
      JOIN products p ON e.product_id = p.id 
      ORDER BY e.created_at DESC, e.id DESC
    `);
    
    console.log('✅ Found enquiries:', enquiries.length); // DEBUG
    res.json(enquiries);
  } catch (error) {
    console.error('getEnquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

module.exports = { createEnquiry, getEnquiries };
