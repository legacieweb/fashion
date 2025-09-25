// utils/sendEmail.js
const nodemailer = require('nodemailer');

// Create transporter with better configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

module.exports = async function sendEmail({ to, subject, text, html }) {
  // Check if email is disabled
  if (process.env.EMAIL_ENABLED === 'false') {
    console.log(`⚠️ Email disabled: ${subject} to ${to}`);
    return { success: false, reason: 'Email disabled' };
  }

  // Skip email sending in development if credentials are not properly configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`⚠️ Email skipped (no credentials): ${subject} to ${to}`);
    return { success: false, reason: 'No credentials' };
  }

  if (process.env.EMAIL_DEBUG === 'true') {
    console.log(`📧 Attempting to send email: ${subject} to ${to}`);
  }

  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: `"Iyonic Fashion" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send error to ${to}:`, error.message);
    
    // Log specific error types for debugging
    if (error.code === 'EAUTH') {
      console.error('❌ Authentication failed. Please check EMAIL_USER and EMAIL_PASS in .env');
      console.error('❌ For Gmail, you need to use an App Password, not your regular password');
      console.error('❌ To generate an App Password:');
      console.error('   1. Go to Google Account settings');
      console.error('   2. Security → 2-Step Verification → App passwords');
      console.error('   3. Generate a new app password for "Mail"');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('❌ Connection failed. This could be due to:');
      console.error('   - Firewall blocking SMTP connections');
      console.error('   - Network restrictions');
      console.error('   - Gmail SMTP temporarily unavailable');
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
