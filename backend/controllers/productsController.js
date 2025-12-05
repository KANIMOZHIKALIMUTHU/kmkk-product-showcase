// controllers/productsController.js
const db = require('../db/connection');

const getProducts = (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT * FROM products 
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND name LIKE ?`;
    params.push(`%${search}%`);
  }
  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  query += ` ORDER BY name LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  db.all(query, params, (err, products) => {
    if (err) {
      console.error('Products query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Get total count
    db.get('SELECT COUNT(*) as total FROM products WHERE 1=1' + (search ? ` AND name LIKE '%${search}%'` : '') + (category ? ` AND category = '${category}'` : ''), (err, count) => {
      res.json({ 
        products, 
        total: count?.total || 0,
        page: Number(page),
        limit: Number(limit)
      });
    });
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });
};

module.exports = { getProducts, getProductById };
