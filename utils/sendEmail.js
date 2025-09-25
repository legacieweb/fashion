// utils/sendEmail.js
require("dotenv").config();
const nodemailer = require('nodemailer');

// Create transporter with private email configuration
const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT) || 465;
  const isSecure = port === 465; // Use SSL for port 465, TLS for 587
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port: port,
    secure: isSecure, // SSL for port 465, TLS for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false, // sometimes helps with self-signed certs
      servername: process.env.SMTP_HOST || "mail.privateemail.com"
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    debug: process.env.EMAIL_DEBUG === 'true', // Enable debug logging
    logger: process.env.EMAIL_DEBUG === 'true' // Enable logger
  });
};

// Verify transporter configuration (non-blocking)
const verifyEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email transporter configuration error:", error.message);
    console.log("⚠️ Email service will continue but may not work properly");
    
    // Log specific troubleshooting steps
    if (error.code === 'ETIMEDOUT') {
      console.log("🔧 Troubleshooting steps for connection timeout:");
      console.log("   1. Check if SMTP_HOST is correct: mail.privateemail.com");
      console.log("   2. Try different ports: 587 (TLS) or 465 (SSL)");
      console.log("   3. Check firewall/network restrictions");
      console.log("   4. Verify your hosting provider allows SMTP connections");
    }
    return false;
  }
};

// Run verification in background (don't block server startup)
setTimeout(() => {
  verifyEmailConnection();
}, 2000); // Wait 2 seconds after server starts

// Try multiple SMTP configurations
const tryMultipleConfigurations = async (mailOptions) => {
  const configurations = [
    // Configuration 1: SSL on port 465
    {
      host: process.env.SMTP_HOST || "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false }
    },
    // Configuration 2: TLS on port 587
    {
      host: process.env.SMTP_HOST || "mail.privateemail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false }
    },
    // Configuration 3: Alternative port 25
    {
      host: process.env.SMTP_HOST || "mail.privateemail.com",
      port: 25,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false }
    }
  ];

  for (let i = 0; i < configurations.length; i++) {
    try {
      console.log(`📧 Trying SMTP configuration ${i + 1}: ${configurations[i].host}:${configurations[i].port} (${configurations[i].secure ? 'SSL' : 'TLS'})`);
      
      const transporter = nodemailer.createTransport(configurations[i]);
      const info = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent successfully with configuration ${i + 1}:`, info.messageId);
      return { success: true, messageId: info.messageId, config: i + 1 };
      
    } catch (error) {
      console.log(`❌ Configuration ${i + 1} failed:`, error.message);
      if (i === configurations.length - 1) {
        throw error; // Throw error only if all configurations failed
      }
    }
  }
};

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
    
    // Try multiple SMTP configurations
    const result = await tryMultipleConfigurations(mailOptions);
    
    console.log("✅ Email sent successfully:", result.messageId);
    console.log("📧 Recipient:", to);
    console.log(`📧 Used configuration: ${result.config}`);
    
    return {
      success: true,
      messageId: result.messageId,
      recipient: to,
      configuration: result.config
    };
    
  } catch (error) {
    console.error("❌ Email sending failed with all configurations:", error);
    
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
