const db = global.db;  // ✅ USE GLOBAL DB DIRECTLY

const getProducts = (req, res) => {
  console.log('🔍 Products controller - db.all:', typeof db.all); // DEBUG
  
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
    if (err) {
      console.error('Products error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    db.get(`SELECT COUNT(*) as total FROM products WHERE 1=1${search ? ` AND name LIKE '%${search}%'` : ''}${category ? ` AND category='${category}'` : ''}`, (err, row) => {
      res.json({
        products,
        total: row ? row.total : 0,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    });
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });
};

module.exports = { getProducts, getProductById };
