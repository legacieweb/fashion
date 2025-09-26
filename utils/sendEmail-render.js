// utils/sendEmail-render.js - Render-optimized email service
require("dotenv").config();
const nodemailer = require('nodemailer');

// Network-optimized configurations for cloud hosting platforms
const getCloudOptimizedConfigurations = () => {
  return [
    // Configuration 1: Private Email with cloud-friendly settings
    {
      name: "Private Email - Cloud Optimized SSL",
      host: process.env.SMTP_HOST || "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      },
      tls: { 
        rejectUnauthorized: false,
        servername: process.env.SMTP_HOST || "mail.privateemail.com",
        // Additional cloud-friendly TLS options
        minVersion: 'TLSv1.2',
        maxVersion: 'TLSv1.3',
        ciphers: 'ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS'
      },
      connectionTimeout: 45000,
      greetingTimeout: 30000,
      socketTimeout: 45000,
      // Cloud platform optimizations
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14 // messages per second
    },
    
    // Configuration 2: Private Email with STARTTLS (often works better on cloud)
    {
      name: "Private Email - Cloud Optimized TLS",
      host: process.env.SMTP_HOST || "mail.privateemail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      },
      tls: { 
        rejectUnauthorized: false,
        servername: process.env.SMTP_HOST || "mail.privateemail.com",
        minVersion: 'TLSv1.2'
      },
      connectionTimeout: 45000,
      greetingTimeout: 30000,
      socketTimeout: 45000,
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    },
    
    // Configuration 3: Alternative ports that work better on cloud platforms
    {
      name: "Private Email - Alternative Port 2587",
      host: process.env.SMTP_HOST || "mail.privateemail.com",
      port: 2587,
      secure: false,
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      },
      tls: { 
        rejectUnauthorized: false,
        servername: process.env.SMTP_HOST || "mail.privateemail.com"
      },
      connectionTimeout: 30000,
      greetingTimeout: 20000,
      socketTimeout: 30000
    },
    
    // Configuration 4: Try with different hostname resolution
    {
      name: "Private Email - IP Resolution",
      host: process.env.SMTP_HOST || "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      },
      tls: { 
        rejectUnauthorized: false,
        servername: process.env.SMTP_HOST || "mail.privateemail.com"
      },
      connectionTimeout: 30000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      // Force IPv4 (sometimes helps with cloud platforms)
      family: 4
    },
    
    // Configuration 5: SendGrid (reliable cloud email service)
    {
      name: "SendGrid Cloud Service",
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
      },
      tls: {
        rejectUnauthorized: false
      }
    },
    
    // Configuration 6: Gmail fallback (if configured)
    ...(process.env.GMAIL_USER && process.env.GMAIL_PASS ? [{
      name: "Gmail Fallback",
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    }] : [])
  ].filter(config => {
    // Filter out configurations that don't have required credentials
    if (config.name === "SendGrid Cloud Service" && !process.env.SENDGRID_API_KEY) {
      return false;
    }
    return true;
  });
};

// Enhanced error handling with cloud-specific troubleshooting
const handleCloudEmailError = (error, configName) => {
  console.log(`❌ ${configName} failed:`, error.message);
  
  if (error.code === 'ETIMEDOUT') {
    console.log(`   🔧 Network timeout - common on cloud platforms`);
    console.log(`   💡 This suggests the SMTP server may not be accessible from cloud networks`);
  } else if (error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
    console.log(`   🔧 Connection refused - port may be blocked by cloud provider`);
    console.log(`   💡 Try alternative ports or contact your email provider about cloud access`);
  } else if (error.code === 'EAUTH') {
    console.log(`   🔧 Authentication failed - credentials may be correct but server unreachable`);
  } else if (error.code === 'ENOTFOUND') {
    console.log(`   🔧 DNS resolution failed - hostname not found from cloud network`);
  }
};

// Try configurations with enhanced cloud compatibility
const tryCloudConfigurations = async (mailOptions) => {
  const configurations = getCloudOptimizedConfigurations();
  
  for (let i = 0; i < configurations.length; i++) {
    try {
      console.log(`📧 Trying cloud configuration ${i + 1}: ${configurations[i].name}`);
      
      const transporter = nodemailer.createTransport(configurations[i]);
      
      // Test connection with timeout
      const connectionPromise = transporter.verify();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 30s')), 30000)
      );
      
      await Promise.race([connectionPromise, timeoutPromise]);
      console.log(`   ✅ Connection verified for ${configurations[i].name}`);
      
      // Send email
      const info = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent successfully with ${configurations[i].name}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      return { 
        success: true, 
        messageId: info.messageId, 
        configName: configurations[i].name,
        configIndex: i + 1
      };
      
    } catch (error) {
      handleCloudEmailError(error, configurations[i].name);
      
      if (i === configurations.length - 1) {
        throw new Error(`All cloud-optimized configurations failed. Last error: ${error.message}`);
      }
    }
  }
};

// Main email sending function optimized for cloud deployment
module.exports = async function sendEmailRender({ to, subject, text, html, shopName = "Iyonic Fashion" }) {
  // Check if email is disabled
  if (process.env.EMAIL_ENABLED === 'false') {
    console.log(`⚠️ Email disabled: ${subject} to ${to}`);
    return { success: false, reason: 'Email disabled' };
  }

  // Skip email sending if credentials are not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`⚠️ Email skipped (no credentials): ${subject} to ${to}`);
    return { success: false, reason: 'No credentials' };
  }

  try {
    // Validate inputs
    if (!to || !to.includes('@')) {
      throw new Error('Invalid recipient email address');
    }
    if (!subject || (!text && !html)) {
      throw new Error('Subject and content (text or html) are required');
    }

    console.log(`📧 [RENDER] Sending email: ${subject} to ${to}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

    const mailOptions = {
      from: `"${shopName}" <${process.env.SMTP_USER}>`,
      to: to.trim(),
      subject,
      text,
      html
    };

    // Try cloud-optimized configurations
    const result = await tryCloudConfigurations(mailOptions);
    
    console.log(`✅ [RENDER] Email sent successfully using ${result.configName}`);
    console.log(`📧 Recipient: ${to}`);
    console.log(`📧 Message ID: ${result.messageId}`);
    
    return {
      success: true,
      messageId: result.messageId,
      recipient: to,
      configName: result.configName,
      environment: 'render'
    };
    
  } catch (error) {
    console.error("❌ [RENDER] All email configurations failed:", error.message);
    
    // Provide cloud-specific troubleshooting
    console.log("\n🔧 RENDER DEPLOYMENT TROUBLESHOOTING:");
    console.log("   1. Your private email server may not be accessible from Render's network");
    console.log("   2. Consider using a cloud-friendly email service:");
    console.log("      • SendGrid (free tier: 100 emails/day)");
    console.log("      • Mailgun (free tier: 5,000 emails/month)");
    console.log("      • Amazon SES (very low cost)");
    console.log("   3. Or set up Gmail with App Password as fallback");
    console.log("   4. Contact your email provider about cloud platform access");
    
    // Don't throw error to prevent signup from failing
    console.log('⚠️ [RENDER] Email sending failed, but continuing with signup process');
    return { 
      success: false, 
      error: error.message,
      environment: 'render',
      troubleshooting: 'Check logs for cloud-specific solutions'
    };
  }
};