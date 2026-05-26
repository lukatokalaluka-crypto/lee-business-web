/*
  Quick PostgreSQL DB test script for this project.
  Usage:
    1) Set DATABASE_URL (and optionally NODE_ENV/SSL handled by server)
    2) Run: node backend/test-db.js

  It will:
   - connect to PG
   - ensure products table exists
   - insert a temporary row
   - read back the row
   - delete the temporary row
   - print results
*/

const dotenv = require('dotenv');
dotenv.config();

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Cannot test DB.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  const tmpName = `__db_test_${Date.now()}`;

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    const clientCheck = await pool.query('SELECT 1 as ok');
    console.log('✅ Connection OK:', clientCheck.rows[0]);

    console.log('🧱 Ensuring products table exists...');
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT
      );
    `;
    await pool.query(createTableSql);
    console.log('✅ Table OK');

    console.log('➕ Inserting temporary row...');
    const insertSql = `
      INSERT INTO products (name, price, image, category, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, price, image, category, description;
    `;

    const inserted = await pool.query(insertSql, [
      tmpName,
      '123.45',
      'https://img.icons8.com/fluency/96/test.png',
      'Software',
      'Temporary test row'
    ]);

    console.log('✅ Inserted:', inserted.rows[0]);

    console.log('🔎 Reading it back...');
    const readSql = `SELECT * FROM products WHERE id = $1;`;
    const read = await pool.query(readSql, [inserted.rows[0].id]);
    console.log('✅ Read back:', read.rows[0]);

    console.log('🧹 Deleting temporary row...');
    await pool.query('DELETE FROM products WHERE id = $1;', [inserted.rows[0].id]);
    console.log('✅ Deleted');

    // Final sanity check
    const count = await pool.query('SELECT COUNT(*)::int AS count FROM products;');
    console.log('📊 Products count:', count.rows[0].count);

    console.log('🎉 DB TEST PASSED');
    process.exit(0);
  } catch (err) {
    console.error('❌ DB TEST FAILED:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();

