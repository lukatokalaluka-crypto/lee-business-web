const fs = require('fs');
const path = require('path');
const pool = require('./db');

(async () => {
  try {
    const dataPath = path.join(__dirname, '..', 'frontend', 'public', 'data.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    const products = parsed.products || [];

    console.log(`Found ${products.length} products to import.`);

    for (const p of products) {
      const imagesJson = p.images ? JSON.stringify(p.images) : '[]';
      const primaryImage = p.image || (Array.isArray(p.images) && p.images[0]) || '';
      const res = await pool.query(
        `INSERT INTO products (name, price, original_price, image, images, category, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id`,
        [p.name, (p.price || '').toString(), p.original_price || '', primaryImage, imagesJson, p.category || 'Misc', p.description || '']
      );
      console.log('Inserted product id', res.rows[0].id);
    }

    console.log('Import finished.');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
