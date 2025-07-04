const Product = require('../models/Product');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Sort by latest
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        message: 'Name, price, and category are required.'
      });
    }

    // Handle image upload path
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    const imagePath = `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;

    const product = new Product({
      name,
      price,
      category,
      image: imagePath
    });

    await product.save();

    res.status(201).json({
      message: '✅ Product created successfully',
      product
    });
  } catch (err) {
    console.error('❌ Error creating product:', err);
    res.status(500).json({ message: 'Server error during product creation' });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).send(); // No content
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
