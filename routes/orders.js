const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 📧 Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔧 Utility: Clean price string
const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
};

// 📧 Function to send email
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Iyonic Fashion" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

// ✅ CREATE ORDER
router.post('/', async (req, res) => {
  try {
    const { userId, name, email, address, zip, items, totalAmount, reference } = req.body;

    if (!name || !email || !address || !zip || !items?.length || !totalAmount || !reference) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // 🔧 Sanitize item prices and totalAmount
    const sanitizedItems = items.map(i => ({
      ...i,
      price: parsePrice(i.price)
    }));
    const sanitizedTotal = parsePrice(totalAmount);

    const newOrder = new Order({
      userId,
      name,
      email,
      address,
      zip,
      items: sanitizedItems,
      totalAmount: sanitizedTotal,
      reference,
      status: 'Pending'
    });

    await newOrder.save();

    // 📧 Send confirmation to user
    await sendEmail(
      email,
      `Order Confirmation - ${reference}`,
      `
        <p>Hi ${name},</p>
        <p>Thank you for your order at <strong>Iyonic Fashion</strong>!</p>
        <p><strong>Order Ref:</strong> ${reference}</p>
        <p><strong>Total:</strong> $${sanitizedTotal.toFixed(2)}</p>
        <p>We will notify you once your order status changes.</p>
      `
    );

    // 📧 Notify admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `🛍 New Order Received - ${reference}`,
      `
        <h3>New Order Details</h3>
        <p><strong>Customer:</strong> ${name} (${email})</p>
        <p><strong>Total:</strong> $${sanitizedTotal.toFixed(2)}</p>
        <p><strong>Address:</strong> ${address}, ZIP: ${zip}</p>
        <p><strong>Reference:</strong> ${reference}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${sanitizedItems.map(i => `<li>${i.title} - Size: ${i.size} - $${i.price}</li>`).join('')}
        </ul>
      `
    );

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ UPDATE ORDER STATUS
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status || order.status;
    await order.save();

    // 📧 Notify user
    await sendEmail(
      order.email,
      `📦 Your Order Status Updated - ${order.reference}`,
      `
        <p>Hi ${order.name},</p>
        <p>Your order status has been updated to: <strong>${order.status}</strong></p>
        <p><strong>Order Ref:</strong> ${order.reference}</p>
        <p>Thank you for shopping with Iyonic Fashion!</p>
      `
    );

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('❌ Error fetching all orders:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET USER ORDERS
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('❌ Error fetching user orders:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET ORDER BY ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, order });
  } catch (error) {
    console.error('❌ Error fetching order:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
