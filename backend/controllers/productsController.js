const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const db = require('../db/connection');
const cacheService = require('../services/cacheService');

const runAsync = promisify(db.run).bind(db);
const getAsync = promisify(db.all).bind(db);
const getOneAsync = promisify(db.get).bind(db);

const MAX_PRODUCTS = 12; // ✅ only first 12 products

const getProducts = async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 9 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;

    const cacheKey = `products:${JSON.stringify({
      search,
      category,
      page: pageNum,
      limit: limitNum,
    })}`;

    if (cacheService.has(cacheKey)) {
      return res.json(cacheService.get(cacheKey));
    }

    let baseWhere = 'WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      baseWhere += ' AND name LIKE ?';
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    if (category) {
      baseWhere += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }

    // 1) Get REAL total matching filters
    const countQuery = `SELECT COUNT(*) AS total FROM products ${baseWhere}`;
    const countResult = await getOneAsync(countQuery, countParams);
    const totalMatching = countResult?.total || 0;

    // 2) Limit the logical total to 12
    const total = Math.min(totalMatching, MAX_PRODUCTS);

    // 3) Compute offset but clamp to first 12 rows
    const offsetRaw = (pageNum - 1) * limitNum;
    if (offsetRaw >= total) {
      // page beyond 12 products → return empty
      const response = { products: [], total };
      cacheService.set(cacheKey, response, 1000 * 60 * 5);
      return res.json(response);
    }

    const effectiveOffset = offsetRaw;
    const effectiveLimit = Math.min(limitNum, total - effectiveOffset);

    const dataQuery = `
      SELECT *
      FROM products
      ${baseWhere}
      ORDER BY created_at ASC, id ASC
      LIMIT ? OFFSET ?
    `;

    const products = await getAsync(dataQuery, [...params, effectiveLimit, effectiveOffset]);

    const response = { products, total };
    cacheService.set(cacheKey, response, 1000 * 60 * 5);
    res.json(response);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getOneAsync('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProducts, getProductById };
