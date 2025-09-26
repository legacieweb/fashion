// test-email-render.js - Comprehensive email testing for Render deployment
require("dotenv").config();
const nodemailer = require('nodemailer');

console.log("🧪 Testing Email Configurations for Render Deployment");
console.log("=" .repeat(60));

// Test configurations specifically designed for cloud hosting
const testConfigurations = [
  {
    name: "Private Email - SSL Port 465",
    config: {
      host: "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { 
        rejectUnauthorized: false,
        servername: "mail.privateemail.com"
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000
    }
  },
  {
    name: "Private Email - TLS Port 587",
    config: {
      host: "mail.privateemail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { 
        rejectUnauthorized: false,
        servername: "mail.privateemail.com"
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000
    }
  },
  {
    name: "Private Email - Submission Port 2525",
    config: {
      host: "mail.privateemail.com",
      port: 2525,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000
    }
  },
  {
    name: "Gmail Fallback",
    config: {
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    },
    skip: !process.env.GMAIL_USER || !process.env.GMAIL_PASS
  }
];

async function testConfiguration(name, config) {
  console.log(`\n🔧 Testing: ${name}`);
  console.log(`   Host: ${config.host || config.service}`);
  console.log(`   Port: ${config.port || 'default'}`);
  console.log(`   Secure: ${config.secure ? 'SSL' : 'TLS/STARTTLS'}`);
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    // Test connection
    console.log("   ⏳ Testing connection...");
    await transporter.verify();
    console.log("   ✅ Connection successful!");
    
    // Test sending email
    console.log("   ⏳ Sending test email...");
    const testEmail = {
      from: `"Iyonic Fashion Test" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER,
      subject: `🧪 Email Test - ${name} - ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e91e63;">✅ Email Test Successful!</h2>
          <p><strong>Configuration:</strong> ${name}</p>
          <p><strong>Host:</strong> ${config.host || config.service}</p>
          <p><strong>Port:</strong> ${config.port || 'default'}</p>
          <p><strong>Security:</strong> ${config.secure ? 'SSL' : 'TLS/STARTTLS'}</p>
          <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
          <hr>
          <p style="color: #666;">This email confirms that your SMTP configuration is working correctly on the Render network.</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(testEmail);
    console.log(`   ✅ Email sent successfully!`);
    console.log(`   📧 Message ID: ${info.messageId}`);
    console.log(`   📬 Recipient: ${testEmail.to}`);
    
    return { success: true, messageId: info.messageId, config: name };
    
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    
    // Provide specific troubleshooting for common errors
    if (error.code === 'ETIMEDOUT') {
      console.log(`   🔧 Network timeout - this configuration may not work on Render`);
    } else if (error.code === 'EAUTH') {
      console.log(`   🔧 Authentication failed - check credentials`);
    } else if (error.code === 'ECONNECTION') {
      console.log(`   🔧 Connection refused - port may be blocked`);
    }
    
    return { success: false, error: error.message, config: name };
  }
}

async function runAllTests() {
  console.log(`📧 Email Configuration Test`);
  console.log(`🔑 SMTP User: ${process.env.SMTP_USER || 'Not set'}`);
  console.log(`🔑 Gmail User: ${process.env.GMAIL_USER || 'Not set'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const results = [];
  
  for (const test of testConfigurations) {
    if (test.skip) {
      console.log(`\n⏭️  Skipping: ${test.name} (credentials not configured)`);
      continue;
    }
    
    const result = await testConfiguration(test.name, test.config);
    results.push(result);
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful configurations: ${successful.length}`);
  console.log(`❌ Failed configurations: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log("\n🎉 WORKING CONFIGURATIONS:");
    successful.forEach(result => {
      console.log(`   ✅ ${result.config} - Message ID: ${result.messageId}`);
    });
    
    console.log("\n🚀 RECOMMENDATION:");
    console.log(`   Use "${successful[0].config}" for your production deployment`);
    console.log(`   This configuration successfully sent emails on the current network`);
  } else {
    console.log("\n⚠️  NO WORKING CONFIGURATIONS FOUND");
    console.log("   Consider using a cloud email service like:");
    console.log("   • SendGrid (sendgrid.com)");
    console.log("   • Mailgun (mailgun.com)");
    console.log("   • Amazon SES (aws.amazon.com/ses)");
    console.log("   • Or configure Gmail as a fallback");
  }
  
  if (failed.length > 0) {
    console.log("\n❌ FAILED CONFIGURATIONS:");
    failed.forEach(result => {
      console.log(`   ❌ ${result.config} - ${result.error}`);
    });
  }
  
  console.log("\n" + "=".repeat(60));
  process.exit(0);
}

// Run the tests
runAllTests().catch(error => {
  console.error("💥 Test runner failed:", error);
  process.exit(1);
});