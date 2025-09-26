// scripts/test-render-email.js - Test email functionality on Render
require("dotenv").config();

// Simulate Render environment
process.env.RENDER = 'true';
process.env.NODE_ENV = 'production';

const sendEmail = require('../utils/sendEmail');

async function testRenderEmail() {
  console.log("🚀 Testing Email Functionality for Render Deployment");
  console.log("=" .repeat(60));
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔧 SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
  console.log(`🎯 Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log("=" .repeat(60));

  try {
    // Test welcome email (like signup would send)
    console.log("\n📧 Testing Welcome Email...");
    const welcomeResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: "🎉 Welcome to Iyonic Fashion - Render Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://i.imgur.com/Vut7Csh.png" alt="Iyonic Fashion" style="width: 80px; height: auto;">
            <h1 style="color: #e91e63; margin: 20px 0;">Welcome to Iyonic Fashion!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">🚀 Render Deployment Test</h2>
            <p>This email confirms that your Fashion Store email system is working correctly on Render!</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="color: #e91e63; margin-top: 0;">✅ Test Results:</h3>
              <ul style="color: #666;">
                <li>✅ Email service initialized successfully</li>
                <li>✅ SMTP connection established</li>
                <li>✅ Email delivery working</li>
                <li>✅ HTML formatting applied</li>
              </ul>
            </div>
            
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Environment:</strong> Render Production</p>
            <p><strong>Service:</strong> Fashion Store Email System</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              This is an automated test email from your Fashion Store deployment.
            </p>
            <p style="color: #e91e63; font-weight: bold;">
              🛍️ Your Fashion Store is ready for customers! 🛍️
            </p>
          </div>
        </div>
      `,
      text: `
Welcome to Iyonic Fashion!

🚀 Render Deployment Test

This email confirms that your Fashion Store email system is working correctly on Render!

✅ Test Results:
- Email service initialized successfully
- SMTP connection established  
- Email delivery working
- HTML formatting applied

Test Time: ${new Date().toLocaleString()}
Environment: Render Production
Service: Fashion Store Email System

🛍️ Your Fashion Store is ready for customers! 🛍️
      `
    });

    if (welcomeResult.success) {
      console.log("✅ Welcome email test PASSED");
      console.log(`📧 Message ID: ${welcomeResult.messageId}`);
      console.log(`🔧 Used configuration: ${welcomeResult.configName}`);
    } else {
      console.log("❌ Welcome email test FAILED");
      console.log(`❌ Error: ${welcomeResult.error}`);
    }

    // Test password reset email
    console.log("\n📧 Testing Password Reset Email...");
    const resetResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: "🔐 Password Reset Code - Render Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://i.imgur.com/Vut7Csh.png" alt="Iyonic Fashion" style="width: 80px; height: auto;">
            <h1 style="color: #e91e63; margin: 20px 0;">Password Reset Request</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>You requested a password reset for your Iyonic Fashion account.</p>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <h2 style="color: #e91e63; margin: 0;">Your Reset Code:</h2>
              <div style="font-size: 32px; font-weight: bold; color: #333; margin: 15px 0; letter-spacing: 5px;">
                TEST123
              </div>
              <p style="color: #666; font-size: 14px;">This is a test code for Render deployment verification</p>
            </div>
            
            <p><strong>⚠️ This is a test email</strong> - Your password reset functionality is working correctly on Render!</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              If you didn't request this test, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
      text: `
Password Reset Request - Iyonic Fashion

You requested a password reset for your Iyonic Fashion account.

Your Reset Code: TEST123

⚠️ This is a test email - Your password reset functionality is working correctly on Render!

Test Time: ${new Date().toLocaleString()}

If you didn't request this test, you can safely ignore this email.
      `
    });

    if (resetResult.success) {
      console.log("✅ Password reset email test PASSED");
      console.log(`📧 Message ID: ${resetResult.messageId}`);
      console.log(`🔧 Used configuration: ${resetResult.configName}`);
    } else {
      console.log("❌ Password reset email test FAILED");
      console.log(`❌ Error: ${resetResult.error}`);
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 RENDER EMAIL TEST SUMMARY");
    console.log("=".repeat(60));
    
    const passedTests = [welcomeResult.success, resetResult.success].filter(Boolean).length;
    const totalTests = 2;
    
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
    
    if (passedTests === totalTests) {
      console.log("\n🎉 ALL TESTS PASSED!");
      console.log("🚀 Your Fashion Store email system is ready for Render deployment!");
      console.log("📧 Users will receive welcome emails when they sign up");
      console.log("🔐 Password reset functionality will work correctly");
    } else {
      console.log("\n⚠️ SOME TESTS FAILED");
      console.log("🔧 Check the error messages above for troubleshooting");
      console.log("💡 Consider using a cloud email service for better reliability");
    }
    
    console.log("\n🌐 Next Steps for Render Deployment:");
    console.log("1. Deploy your app to Render");
    console.log("2. Set environment variables in Render dashboard");
    console.log("3. Test signup functionality in production");
    console.log("4. Monitor email delivery in Render logs");
    
  } catch (error) {
    console.error("💥 Test failed with error:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your .env file has correct SMTP settings");
    console.log("2. Verify your email server allows connections from cloud platforms");
    console.log("3. Consider using Gmail or a cloud email service as fallback");
  }
}

// Run the test
testRenderEmail();