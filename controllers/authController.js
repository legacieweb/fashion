const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const resetCodes = new Map(); // email -> { code, expires }

// 🔐 Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// ======================
// ✅ Signup
// ======================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    // ✅ Send Welcome Email
    await sendEmail({
      to: email,
      subject: 'Welcome to Iyonic Fashion 👗',
      text: `Hi ${name},\n\nThank you for signing up! You can now access your dashboard and shop with us.\n\n- Iyonic Fashion`
    });

    res.status(201).json({
      message: 'Signup successful',
      user: { _id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ======================
// ✅ Login
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ======================
// ✅ Send Reset Code
// ======================
exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No account with that email' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 1000 * 60 * 10; // 10 min

  resetCodes.set(email, { code, expires });

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your Iyonic password',
      text: `Your password reset code is: ${code}\nThis code will expire in 10 minutes.`
    });

    res.json({ message: 'Reset code sent to email' });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    res.status(500).json({ message: 'Failed to send reset code' });
  }
};

// ======================
// ✅ Reset Password
// ======================
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: 'All fields are required' });

  const record = resetCodes.get(email);
  if (!record || record.code !== code)
    return res.status(400).json({ message: 'Invalid or expired reset code' });

  if (Date.now() > record.expires) {
    resetCodes.delete(email);
    return res.status(400).json({ message: 'Reset code expired' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.password = newPassword;
  await user.save();
  resetCodes.delete(email);

  // ✅ Send confirmation email
  await sendEmail({
    to: email,
    subject: 'Your Iyonic password was changed',
    text: `Hi ${user.name},\n\nYour password has been successfully updated.\n\nIf you didn't do this, contact support immediately.`
  });

  res.json({ message: 'Password reset successful' });
};
