// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Iyonic Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log(`✅ Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`❌ Email send error to ${to}:`, error.message);
    throw error;
  }
};
