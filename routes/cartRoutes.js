const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/authMiddleware');

// 🛒 POST /api/cart/add - Add item to cart
router.post('/add', auth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Valid productId and quantity > 0 are required' });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity: Number(quantity) }]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({ productId, quantity: Number(quantity) });
      }
    }

    await cart.save();
    res.status(200).json({ message: '✅ Added to cart successfully', cart });
  } catch (err) {
    console.error('❌ Cart Add Error:', err);
    res.status(500).json({ error: 'Server error while adding to cart' });
  }
});

// 📦 GET /api/cart - Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) {
      return res.status(200).json({ message: '🛒 Your cart is empty', items: [] });
    }

    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.error('❌ Cart Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// ❌ DELETE /api/cart/remove/:productId - Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    if (cart.items.length === originalLength) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    await cart.save();
    res.status(200).json({ message: '🗑 Item removed from cart', cart });
  } catch (err) {
    console.error('❌ Cart Remove Error:', err);
    res.status(500).json({ error: 'Server error while removing item' });
  }
});

// 🧹 DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.status(200).json({ message: '🧹 Cart cleared successfully' });
  } catch (err) {
    console.error('❌ Cart Clear Error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
