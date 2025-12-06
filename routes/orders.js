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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000000; color: #ec4899; padding: 20px; border: 2px solid #ec4899; border-radius: 15px;">
          <h2 style="color: #f472b6; text-align: center;">Order Confirmation</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for your order at <strong style="color: #f472b6;">Iyonic Fashion</strong>!</p>
          <p><strong>Order Reference:</strong> ${reference}</p>
          <p><strong>Total:</strong> $${sanitizedTotal.toFixed(2)}</p>
          <h3 style="color: #f472b6; margin-top: 20px;">Order Items:</h3>
          <ul style="list-style: none; padding: 0;">
            ${sanitizedItems.map(i => `
              <li style="background: rgba(236, 72, 153, 0.1); padding: 10px; margin: 10px 0; border-radius: 8px; border: 1px solid rgba(236, 72, 153, 0.3);">
                <strong>${i.title}</strong><br/>
                ${i.color ? `🎨 Color: <strong>${i.color}</strong><br/>` : ''}
                📏 Size: <strong>${i.size}</strong><br/>
                💰 Price: <strong>$${i.price}</strong>
              </li>
            `).join('')}
          </ul>
          <p style="margin-top: 20px;">We will notify you once your order status changes.</p>
          <p style="text-align: center; margin-top: 30px; color: #f472b6;">Thank you for shopping with us! 💖</p>
        </div>
      `
    );

    // 📧 Notify admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `🛍 New Order Received - ${reference}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f9f9f9; padding: 25px; border: 3px solid #ec4899; border-radius: 15px;">
          <h2 style="color: #ec4899; text-align: center; border-bottom: 2px solid #ec4899; padding-bottom: 15px;">🛍 New Order Received</h2>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ec4899;">
            <h3 style="color: #f472b6; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>ZIP Code:</strong> ${zip}</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ec4899;">
            <h3 style="color: #f472b6; margin-top: 0;">Order Details</h3>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Total Amount:</strong> <span style="color: #ec4899; font-size: 1.3em; font-weight: bold;">$${sanitizedTotal.toFixed(2)}</span></p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ec4899;">
            <h3 style="color: #f472b6; margin-top: 0;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #ec4899; color: white;">
                  <th style="padding: 10px; text-align: left; border: 1px solid #ec4899;">Product</th>
                  <th style="padding: 10px; text-align: center; border: 1px solid #ec4899;">Color</th>
                  <th style="padding: 10px; text-align: center; border: 1px solid #ec4899;">Size</th>
                  <th style="padding: 10px; text-align: right; border: 1px solid #ec4899;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${sanitizedItems.map(i => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; border: 1px solid #eee;"><strong>${i.title}</strong></td>
                    <td style="padding: 10px; text-align: center; border: 1px solid #eee;">${i.color ? `🎨 ${i.color}` : '-'}</td>
                    <td style="padding: 10px; text-align: center; border: 1px solid #eee;">📏 ${i.size}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #eee; font-weight: bold;">$${i.price}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <p style="text-align: center; color: #666; margin-top: 30px; font-size: 0.9em;">
            Please process this order as soon as possible.
          </p>
        </div>
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
