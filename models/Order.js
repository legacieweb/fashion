const mongoose = require('mongoose');
const crypto = require('crypto');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest checkout
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  items: [
    {
      id: { type: String, required: true },       // product ID
      title: { type: String, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true, default: 0 }, // Ensure numeric
      image: { type: String }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true // handles createdAt and updatedAt
});

// 🔐 Auto-generate order reference if not provided
OrderSchema.pre('validate', function (next) {
  if (!this.reference) {
    const randomCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    this.reference = `IYONIC-${date}-${randomCode}`;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
