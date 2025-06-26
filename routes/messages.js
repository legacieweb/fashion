const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail'); // 📨 Custom mailer

// ✅ User sends message to admin
router.post('/', async (req, res) => {
  const { userId, content } = req.body;
  if (!userId || !content) return res.status(400).json({ message: 'Missing fields' });

  try {
    const isFirstMessage = !(await Message.exists({ userId, sender: 'user' }));

    const msg = new Message({ userId, sender: 'user', content });
    await msg.save();

    // 📨 Email to admin only on first message
    if (isFirstMessage) {
      const user = await User.findById(userId);
      await sendEmail({
        to: 'admin@example.com',
        subject: `📩 New Message from ${user.name || 'User'}`,
        text: `You've received a new message:\n\n${content}\n\nFrom: ${user.email}`
      });
    }

    res.status(201).json({ message: 'Message sent', msg });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

// ✅ Admin replies to user
router.post('/reply', async (req, res) => {
  const { userId, content } = req.body;
  if (!userId || !content) return res.status(400).json({ message: 'Missing fields' });

  try {
    const isFirstReply = !(await Message.exists({ userId, sender: 'admin' }));

    const msg = new Message({ userId, sender: 'admin', content });
    await msg.save();

    // 📨 Email to user only on first reply
    if (isFirstReply) {
      const user = await User.findById(userId);
      await sendEmail({
        to: user.email,
        subject: '📨 Admin has replied to your message',
        text: `Hello ${user.name || 'there'},\n\nThe admin replied:\n\n"${content}"`
      });
    }

    res.status(201).json({ message: 'Reply sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reply', error: err.message });
  }
});

// ✅ Get all users with messages
router.get('/users', async (req, res) => {
  try {
    const userIds = await Message.distinct('userId');
    const users = await User.find({ _id: { $in: userIds } }, 'name email');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// ✅ Get all messages for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const messages = await Message.find({ userId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

module.exports = router;
