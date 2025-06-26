const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  sendResetCode,
  resetPassword
} = require('../controllers/authController');

const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // ✅ Import email utility

// 🔐 Standard Auth Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/send-reset-code', sendResetCode);
router.post('/reset-password', resetPassword);

// 🔐 Change Password with Email Notification
router.put('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    // ✅ Send confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Password Was Changed',
        text: `Hi ${user.name || 'User'},\n\nYour password has been successfully updated.\n\nIf this wasn't you, please contact support immediately.\n\n- Iyonic Fashion Team`
      });
    } catch (emailErr) {
      console.error(`⚠️ Failed to send password change email to ${user.email}:`, emailErr.message);
    }

    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error('❌ Change password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
