const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1 LIMIT 1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password_hash || '');
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    req.session.isAdmin = true;
    req.session.adminId = admin.id;
    return res.json({ success: true, message: 'Admin authenticated.' });
  } catch (err) {
    console.error('Auth login error:', err.message);
    return res.status(500).json({ success: false, message: 'Authentication failed.' });
  }
});

router.get('/check', (req, res) => {
  if (req.session?.isAdmin) {
    return res.json({ success: true, isAdmin: true });
  }
  res.status(200).json({ success: true, isAdmin: false });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });
});

module.exports = router;
