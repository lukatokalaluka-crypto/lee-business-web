const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');
const pool = require('./db');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const adminsRouter = require('./routes/admins');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secure-random-string-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL,
        image TEXT,
        category VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);
    console.log('✅ PostgreSQL database initialized.');
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
  }
};

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/admins', adminsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

initDb();

app.listen(PORT, () => {
  console.log(`Backend API server running on http://localhost:${PORT}`);
  console.log(`Client origin is ${CLIENT_ORIGIN}`);
});
