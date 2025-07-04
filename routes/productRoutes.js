const express = require('express');
const router = express.Router();
const multer = require('multer');
const { create, getAll, remove } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', getAll);
router.post('/', auth, upload.single('image'), create);
router.delete('/:id', auth, remove);

module.exports = router;
