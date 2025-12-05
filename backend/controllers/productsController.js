const { getDB } = require('../lib/db');

const getProducts = (req, res) => {
  try {
    const db = getDB();
    console.log('✅ Products using DB singleton');
    
    const { search, category, page = 1, limit = 6 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    let sql = 'SELECT * FROM products WHERE 1=1';
    let params = [];

    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    db.all(sql, params, (err, products) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get(`SELECT COUNT(*) as total FROM products WHERE 1=1${search ? ` AND name LIKE '%${search}%'` : ''}${category ? ` AND category='${category}'` : ''}`, (err, row) => {
        res.json({
          products: products || [],
          total: row?.total || 0,
          page: parseInt(page),
          limit: parseInt(limit)
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProducts, getProductById };
