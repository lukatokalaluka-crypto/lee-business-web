const pool = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'business@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

async function seed() {
  console.log('🌱 Seeding database (admins)...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Ensure products table exists (no mock inserts)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL,
        image TEXT,
        category VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);

    // Insert or update admin user
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const upsertSql = `
      INSERT INTO admins (email, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING *;
    `;
    const res = await client.query(upsertSql, [ADMIN_EMAIL, hashed]);

    await client.query('COMMIT');
    console.log('✅ Admin seed successful!', res.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seed();