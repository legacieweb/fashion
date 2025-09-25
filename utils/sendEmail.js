// utils/sendEmail.js
require("dotenv").config();
const nodemailer = require('nodemailer');

// Create transporter with private email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // TLS on port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false // sometimes helps with self-signed certs
    }
  });
};

// Verify transporter configuration
const transporter = createTransporter();
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

module.exports = async function sendEmail({ to, subject, text, html, shopName = "Iyonic Fashion" }) {
  // Check if email is disabled
  if (process.env.EMAIL_ENABLED === 'false') {
    console.log(`⚠️ Email disabled: ${subject} to ${to}`);
    return { success: false, reason: 'Email disabled' };
  }

  // Skip email sending in development if credentials are not properly configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
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
      console.log(`📧 Attempting to send email: ${subject} to ${to}`);
    }

    const mailOptions = {
      from: `"${shopName}" <${process.env.SMTP_USER}>`,
      to: to.trim(), // Ensure no whitespace issues
      subject,
      text,
      html
    };

    console.log(`📧 Sending email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully:", info.messageId);
    console.log("📧 Recipient:", to);
    
    return {
      success: true,
      messageId: info.messageId,
      recipient: to
    };
    
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    
    // Log specific error types for debugging
    if (error.code === 'EAUTH') {
      console.error('❌ Authentication failed. Please check SMTP_USER and SMTP_PASS in .env');
      console.error('❌ Verify your private email credentials are correct');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('❌ Connection failed. This could be due to:');
      console.error('   - Firewall blocking SMTP connections');
      console.error('   - Network restrictions');
      console.error('   - SMTP server temporarily unavailable');
      console.error('   - Incorrect SMTP_HOST or SMTP_PORT settings');
    }
    
    // Log the email content for debugging purposes
    console.log(`📧 Email content that failed to send:`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Text: ${text?.substring(0, 100)}...`);
    
    // Don't throw error to prevent signup from failing
    console.log('⚠️ Email sending failed, but continuing with signup process');
    return { success: false, error: error.message };
  }
};
