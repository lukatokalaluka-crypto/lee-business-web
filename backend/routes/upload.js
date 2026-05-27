const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const isAdminApi = (req, res, next) => {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized access' });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFromBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    stream.end(buffer);
  });

router.post('/', isAdminApi, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required.' });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ success: false, message: 'Cloudinary is not configured.' });
  }

  try {
    const result = await uploadFromBuffer(req.file.buffer);
    return res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to upload image to Cloudinary.' });
  }
});

module.exports = router;
