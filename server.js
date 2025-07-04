const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const User = require('./models/User');

const app = express();

// CORS config - allow your frontend origin explicitly for better security
app.use(cors({
  origin: 'http://localhost:YOUR_FRONTEND_PORT', // replace with your actual frontend port or domain
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// For React Router or SPA support - serve index.html for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'nagarvikas456@gmail.com' });
    if (!existingAdmin) {
      const admin = new User({
        name: 'Vikas Nagar',
        email: 'nagarvikas456@gmail.com',
        password: 'Vikas123', // Make sure you hash passwords in your User model pre-save hook!
        isAdmin: true,
      });
      await admin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('⚠️ Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

createAdminUser();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
