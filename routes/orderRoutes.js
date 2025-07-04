const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Order = require('../models/order');
const Cart = require('../models/Cart');

// POST /api/orders/checkout - place an order from cart
router.post('/checkout', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // Create order document
    const order = new Order({
      userId: req.user._id,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      totalAmount
    });

    await order.save();

    // Clear user's cart after order placed
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error('Checkout Error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders - fetch all orders for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId - fetch a single order by ID for logged-in user
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id }).populate('items.productId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (err) {
    console.error('Get Order Error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
