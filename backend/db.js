const { Pool } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASEURL || 'postgresql://localhost:5432/hhmedia';
const useSsl = Boolean(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
