// utils/sendEmail.js - Gmail configuration from iyonicpay
require("dotenv").config();
const nodemailer = require('nodemailer');

// Create Gmail transporter with enhanced settings for cloud deployment
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Enhanced settings for cloud platforms
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 14, // messages per second
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Verify Gmail connection (non-blocking)
const verifyEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Gmail email server is ready to send messages");
    console.log(`📧 Using email: ${process.env.EMAIL_USER}`);
    return true;
  } catch (error) {
    console.error("❌ Gmail configuration error:", error.message);
    console.log("⚠️ Email service will continue but may not work properly");
    
    if (error.code === 'EAUTH') {
      console.log("🔧 Gmail authentication failed:");
      console.log("   1. Check if EMAIL_USER and EMAIL_PASS are correct");
      console.log("   2. Make sure you're using an App Password, not regular password");
      console.log("   3. Verify 2-Factor Authentication is enabled on Gmail");
    }
    return false;
  }
};

// Run verification in background (don't block server startup)
setTimeout(() => {
  verifyEmailConnection();
}, 2000); // Wait 2 seconds after server starts

// Simple Gmail email sending (from iyonicpay)
const sendGmailEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to ${mailOptions.to}: ${info.messageId}`);
    return { 
      success: true, 
      messageId: info.messageId,
      service: 'Gmail'
    };
  } catch (error) {
    console.error(`❌ Failed to send email to ${mailOptions.to}:`, error.message);
    throw error;
  }
};

// Simple Gmail email function (from iyonicpay)
module.exports = async function sendEmail({ to, subject, text, html, shopName = "Iyonic Fashion" }) {
  // Check if email is disabled
  if (process.env.EMAIL_ENABLED === 'false') {
    console.log(`⚠️ Email disabled: ${subject} to ${to}`);
    return { success: false, reason: 'Email disabled' };
  }

  // Skip email sending if credentials are not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`⚠️ Email skipped (no credentials): ${subject} to ${to}`);
    return { success: false, reason: 'No credentials' };
  }

  try {
    // Validate email address
    if (!to || !to.includes('@')) {
      throw new Error('Invalid recipient email address');
    }

    // Validate required fields
    if (!subject || (!text && !html)) {
      throw new Error('Subject and content (text or html) are required');
    }

    if (process.env.EMAIL_DEBUG === 'true') {
      console.log(`📧 Sending Gmail email: ${subject} to ${to}`);
    }

    const mailOptions = {
      from: `"${shopName}" <${process.env.EMAIL_USER}>`,
      to: to.trim(),
      subject,
      text: text || '', // fallback for clients that don't support HTML
      html,
    };

    // Send email using Gmail
    const result = await sendGmailEmail(mailOptions);
    
    console.log("✅ Gmail email sent successfully:", result.messageId);
    console.log("📧 Recipient:", to);
    console.log("📧 Service: Gmail");
    
    return {
      success: true,
      messageId: result.messageId,
      recipient: to,
      service: 'Gmail'
    };
    
  } catch (error) {
    console.error("❌ Gmail email sending failed:", error.message);
    
    // Log specific error types for debugging
    if (error.code === 'EAUTH') {
      console.error('❌ Gmail authentication failed. Check EMAIL_USER and EMAIL_PASS in .env');
      console.error('❌ Make sure you are using Gmail App Password, not regular password');
    }
    
    // Don't throw error to prevent signup from failing
    console.log('⚠️ Email sending failed, but continuing with signup process');
    return { success: false, error: error.message };
  }
};
