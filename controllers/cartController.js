const Cart = require('../models/Cart');

exports.saveCart = async (req, res) => {
  const existing = await Cart.findOne({ userId: req.user._id });
  if (existing) {
    existing.items = req.body.items;
    await existing.save();
    res.json(existing);
  } else {
    const cart = new Cart({ userId: req.user._id, items: req.body.items });
    await cart.save();
    res.json(cart);
  }
};

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  res.json(cart || { items: [] });
};
