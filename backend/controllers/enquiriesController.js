const db = global.db;  // ✅ SAME GLOBAL FIX
const emailService = require('../services/emailService');
const { enquiryValidation } = require('../middleware/validation');

const createEnquiry = async (req, res) => {
  try {
    const { error } = enquiryValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { product_id, name, email, phone, message } = req.body;

    // USE NATIVE SQLite promises
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO enquiries (product_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
        [product_id, name, email, phone, message],
        function(err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    })
    .then(lastID => {
      emailService.sendEnquiryNotification({ id: lastID, name, email, product_id });
      res.status(201).json({ success: true, id: lastID });
    })
    .catch(error => {
      console.error('createEnquiry error:', error);
      res.status(500).json({ error: 'Failed to create enquiry' });
    });
  } catch (error) {
    console.error('createEnquiry error:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
};

const getEnquiries = async (req, res) => {
  db.all(`
    SELECT e.*, p.name as product_name 
    FROM enquiries e 
    JOIN products p ON e.product_id = p.id 
    ORDER BY e.created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('getEnquiries error:', err);
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
    res.json(rows);
  });
};

module.exports = { createEnquiry, getEnquiries };
