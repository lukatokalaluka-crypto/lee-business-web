const express = require('express');
const pool = require('../db');
const router = express.Router();

const isAdminApi = (req, res, next) => {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized access' });
};

router.get('/', async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 100, 1);
  const offset = (page - 1) * limit;
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
    const totalProducts = Number(countResult.rows[0].count);
    res.json({ products: result.rows, totalProducts, totalPages: Math.ceil(totalProducts / limit), currentPage: page });
  } catch (err) {
    console.error('Product fetch error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load products.' });
  }
});

router.get('/:id', async (req, res) => {
  const productId = Number(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error('Product lookup error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load product.' });
  }
});

router.post('/', isAdminApi, async (req, res) => {
  const { name, price, original_price, image, category, description, images } = req.body;
  const imagesJson = Array.isArray(images) ? JSON.stringify(images) : images || '[]';
  const primaryImage = image || (Array.isArray(images) && images.length > 0 ? images[0] : '');
  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, original_price, image, images, category, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, price, original_price || '', primaryImage, imagesJson, category, description || '']
    );
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

router.put('/:id', isAdminApi, async (req, res) => {
  const productId = Number(req.params.id);
  const { name, price, original_price, image, category, description, images } = req.body;
  const imagesJson = Array.isArray(images) ? JSON.stringify(images) : images || '[]';
  const primaryImage = image || (Array.isArray(images) && images.length > 0 ? images[0] : '');
  try {
    const result = await pool.query(
      'UPDATE products SET name=$1, price=$2, original_price=$3, image=$4, images=$5, category=$6, description=$7 WHERE id=$8 RETURNING *',
      [name, price, original_price || '', primaryImage, imagesJson, category, description || '', productId]
    );
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error('Update product error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

router.delete('/:id', isAdminApi, async (req, res) => {
  const productId = Number(req.params.id);
  try {
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [productId]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

module.exports = router;
