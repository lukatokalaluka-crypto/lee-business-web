const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const router = express.Router();

const isAdminApi = (req, res, next) => {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized access' });
};

// List admins (id, email, created_at)
router.get('/', isAdminApi, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, created_at FROM admins ORDER BY id ASC');
    res.json({ success: true, admins: result.rows, currentAdminId: req.session.adminId || null });
  } catch (err) {
    console.error('List admins error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load admins.' });
  }
});

// Create admin
router.post('/', isAdminApi, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required.' });
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash RETURNING id, email, created_at`,
      [email, password_hash]
    );
    res.json({ success: true, admin: result.rows[0] });
  } catch (err) {
    console.error('Create admin error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create admin.' });
  }
});

// Update admin details (email and/or password)
router.put('/:id', isAdminApi, async (req, res) => {
  const id = Number(req.params.id);
  const { email, password } = req.body;
  if (!email && !password) return res.status(400).json({ success: false, message: 'Email or password required to update.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (email) {
      // ensure no other admin uses this email
      const conflict = await client.query('SELECT id FROM admins WHERE email = $1 AND id <> $2 LIMIT 1', [email, id]);
      if (conflict.rowCount > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ success: false, message: 'Email already in use by another admin.' });
      }
    }
    let password_hash = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }
    const updateRes = await client.query(
      `UPDATE admins SET email = COALESCE($1, email), password_hash = COALESCE($2, password_hash) WHERE id = $3 RETURNING id, email, created_at`,
      [email || null, password_hash || null, id]
    );
    if (updateRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }
    await client.query('COMMIT');
    res.json({ success: true, admin: updateRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update admin error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update admin.' });
  } finally {
    client.release();
  }
});

// Delete admin
router.delete('/:id', isAdminApi, async (req, res) => {
  const id = Number(req.params.id);
  try {
    // Prevent deleting the currently logged-in admin
    if (req.session?.adminId && Number(req.session.adminId) === id) {
      return res.status(400).json({ success: false, message: 'Cannot delete the currently logged-in admin.' });
    }
    // Prevent deleting last admin
    const countRes = await pool.query('SELECT COUNT(*)::int as count FROM admins');
    const count = countRes.rows[0].count;
    if (count <= 1) return res.status(400).json({ success: false, message: 'Cannot delete the last admin.' });

    const result = await pool.query('DELETE FROM admins WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Admin not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete admin error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete admin.' });
  }
});

module.exports = router;
