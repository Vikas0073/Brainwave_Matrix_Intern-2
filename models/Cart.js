const mongoose = require('mongoose');

// 🧾 Schema for individual items in the cart
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Will populate product info when queried
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Quantity cannot be less than 1']
  }
});

// 🛒 Cart Schema for each user
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Ensures 1 cart per user
  },
  items: {
    type: [cartItemSchema],
    default: []
  }
}, {
  timestamps: true // Automatically adds createdAt & updatedAt
});

module.exports = mongoose.model('Cart', cartSchema);
