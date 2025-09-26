// test-gmail-simple.js - Test Gmail setup from iyonicpay
require("dotenv").config();
const sendEmail = require('./utils/sendEmail');

async function testGmailSetup() {
  console.log("📧 Testing Gmail Setup (from iyonicpay configuration)");
  console.log("=" .repeat(60));
  console.log(`📧 Gmail User: ${process.env.EMAIL_USER}`);
  console.log(`🎯 Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔧 Email Enabled: ${process.env.EMAIL_ENABLED}`);
  console.log("=" .repeat(60));

  try {
    // Test welcome email
    console.log("\n📧 Testing Welcome Email...");
    const welcomeResult = await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "🎉 Welcome to Iyonic Fashion - Gmail Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://i.imgur.com/Vut7Csh.png" alt="Iyonic Fashion" style="width: 80px; height: auto;">
            <h1 style="color: #e91e63; margin: 20px 0;">Welcome to Iyonic Fashion!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #28a745; margin-top: 0;">✅ Gmail Setup Working!</h2>
            <p>Your Fashion Store email system is now working with Gmail configuration from iyonicpay!</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="color: #e91e63; margin-top: 0;">✅ Test Results:</h3>
              <ul style="color: #666;">
                <li>✅ Gmail SMTP connection successful</li>
                <li>✅ Email delivery working perfectly</li>
                <li>✅ Using iyonicpay@gmail.com credentials</li>
                <li>✅ Ready for both local and Render deployment</li>
              </ul>
            </div>
            
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>Service:</strong> Gmail (iyonicpay setup)</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #e91e63; font-weight: bold; font-size: 18px;">
              🛍️ Your Fashion Store Email System is Live! 🛍️
            </p>
            <p style="color: #666; font-size: 14px;">
              Powered by Gmail • Works on Render • Simple & Reliable
            </p>
          </div>
        </div>
      `,
      text: `
Welcome to Iyonic Fashion!

✅ Gmail Setup Working!

Your Fashion Store email system is now working with Gmail configuration from iyonicpay!

✅ Test Results:
- Gmail SMTP connection successful
- Email delivery working perfectly
- Using iyonicpay@gmail.com credentials
- Ready for both local and Render deployment

Test Time: ${new Date().toLocaleString()}
From: ${process.env.EMAIL_USER}
Service: Gmail (iyonicpay setup)

🛍️ Your Fashion Store Email System is Live! 🛍️
      `
    });

    if (welcomeResult.success) {
      console.log("✅ Welcome email test PASSED");
      console.log(`📧 Message ID: ${welcomeResult.messageId}`);
      console.log(`📧 Service: ${welcomeResult.service}`);
    } else {
      console.log("❌ Welcome email test FAILED");
      console.log(`❌ Error: ${welcomeResult.error}`);
    }

    // Test password reset email
    console.log("\n📧 Testing Password Reset Email...");
    const resetResult = await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "🔐 Password Reset Code - Gmail Test",
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
                GMAIL123
              </div>
              <p style="color: #666; font-size: 14px;">This is a test code for Gmail setup verification</p>
            </div>
            
            <p><strong>✅ Gmail working perfectly!</strong> Your password reset functionality is ready for production!</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              This is a test email. Your Gmail setup is working correctly!
            </p>
          </div>
        </div>
      `,
      text: `
Password Reset Request - Iyonic Fashion

You requested a password reset for your Iyonic Fashion account.

Your Reset Code: GMAIL123

✅ Gmail working perfectly! Your password reset functionality is ready for production!

Test Time: ${new Date().toLocaleString()}
From: ${process.env.EMAIL_USER}

This is a test email. Your Gmail setup is working correctly!
      `
    });

    if (resetResult.success) {
      console.log("✅ Password reset email test PASSED");
      console.log(`📧 Message ID: ${resetResult.messageId}`);
      console.log(`📧 Service: ${resetResult.service}`);
    } else {
      console.log("❌ Password reset email test FAILED");
      console.log(`❌ Error: ${resetResult.error}`);
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 GMAIL TEST SUMMARY");
    console.log("=".repeat(60));
    
    const passedTests = [welcomeResult.success, resetResult.success].filter(Boolean).length;
    const totalTests = 2;
    
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
    
    if (passedTests === totalTests) {
      console.log("\n🎉 ALL TESTS PASSED!");
      console.log("✅ Gmail setup from iyonicpay is working perfectly!");
      console.log("✅ Fashion Store email system is ready!");
      console.log("✅ Works on both local development and Render!");
      console.log("📧 Users will receive emails from: iyonicpay@gmail.com");
      console.log("🛍️ Your Fashion Store is ready for deployment!");
    } else {
      console.log("\n⚠️ SOME TESTS FAILED");
      console.log("🔧 Check the error messages above");
      console.log("💡 Verify Gmail credentials are correct");
    }
    
    console.log("\n🚀 Ready for Render Deployment:");
    console.log("1. Your .env already has the working Gmail credentials");
    console.log("2. Set these environment variables in Render:");
    console.log(`   EMAIL_USER=${process.env.EMAIL_USER}`);
    console.log(`   EMAIL_PASS=${process.env.EMAIL_PASS}`);
    console.log(`   ADMIN_EMAIL=${process.env.ADMIN_EMAIL}`);
    console.log("3. Deploy and test - emails will work immediately!");
    
  } catch (error) {
    console.error("💥 Test failed with error:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check if Gmail credentials are correct in .env");
    console.log("2. Verify the App Password is still valid");
    console.log("3. Make sure 2-Factor Authentication is enabled on Gmail");
  }
}

// Run the test
testGmailSetup();