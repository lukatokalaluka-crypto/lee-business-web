const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const isAdminApi = (req, res, next) => {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized access' });
};

const isValidCloudinaryName = (name) =>
  typeof name === 'string' &&
  name.trim() !== '' &&
  name.trim().toLowerCase() !== 'root' &&
  !name.includes(' ') &&
  !name.toLowerCase().includes('your_');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured =
  isValidCloudinaryName(cloudName) && Boolean(cloudApiKey) && Boolean(cloudApiSecret);

if (!isCloudinaryConfigured) {
  console.error('Cloudinary configuration is invalid:', {
    cloudName,
    apiKeyPresent: Boolean(cloudApiKey),
    apiSecretPresent: Boolean(cloudApiSecret),
  });
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudApiSecret,
  });
}

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

  if (!isCloudinaryConfigured) {
    return res.status(500).json({
      success: false,
      message:
        'Cloudinary is not configured correctly. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET with valid values.',
    });
  }

  try {
    const result = await uploadFromBuffer(req.file.buffer);
    return res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    const errorMessage = err?.message || 'Failed to upload image to Cloudinary.';
    return res.status(500).json({ success: false, message: errorMessage });
  }
});

module.exports = router;
