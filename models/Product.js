const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String, // ✅ New field
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
