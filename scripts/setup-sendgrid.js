// scripts/setup-sendgrid.js - Quick SendGrid setup test
require("dotenv").config();
const nodemailer = require('nodemailer');

async function testSendGrid() {
  console.log("🚀 SendGrid Setup Test for Fashion Store");
  console.log("=" .repeat(50));
  
  // Check if SendGrid API key is configured
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your-sendgrid-api-key') {
    console.log("❌ SendGrid API key not configured");
    console.log("\n📋 Setup Instructions:");
    console.log("1. Go to https://sendgrid.com and create a free account");
    console.log("2. Create an API key with Mail Send permissions");
    console.log("3. Add to your .env file:");
    console.log("   SENDGRID_API_KEY=SG.your-actual-api-key");
    console.log("4. Run this script again");
    return;
  }
  
  console.log("✅ SendGrid API key found");
  console.log(`🔑 API Key: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);
  
  try {
    // Create SendGrid transporter
    const transporter = nodemailer.createTransport({
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
    });
    
    console.log("\n⏳ Testing SendGrid connection...");
    await transporter.verify();
    console.log("✅ SendGrid connection successful!");
    
    console.log("\n📧 Sending test email...");
    const testEmail = {
      from: `"Iyonic Fashion" <${process.env.SMTP_USER || 'hello@iyonicorp.com'}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'hello@iyonicorp.com',
      subject: "🎉 SendGrid Setup Successful - Fashion Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://i.imgur.com/Vut7Csh.png" alt="Iyonic Fashion" style="width: 80px;">
            <h1 style="color: #e91e63; margin: 20px 0;">🎉 SendGrid Setup Complete!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #28a745; margin-top: 0;">✅ Email System Ready!</h2>
            <p>Your Fashion Store email system is now configured with SendGrid and ready for production deployment on Render!</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="color: #e91e63; margin-top: 0;">What's Working:</h3>
              <ul style="color: #666;">
                <li>✅ SendGrid SMTP connection established</li>
                <li>✅ Email delivery working perfectly</li>
                <li>✅ Professional emails from your domain</li>
                <li>✅ Ready for Render deployment</li>
              </ul>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">🚀 Next Steps:</h3>
              <ol style="color: #666;">
                <li>Add SENDGRID_API_KEY to your Render environment variables</li>
                <li>Deploy your Fashion Store to Render</li>
                <li>Test user signup to confirm welcome emails work</li>
                <li>Your customers will receive professional emails!</li>
              </ol>
            </div>
            
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Service:</strong> SendGrid SMTP</p>
            <p><strong>Status:</strong> ✅ Ready for Production</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #e91e63; font-weight: bold; font-size: 18px;">
              🛍️ Your Fashion Store Email System is Live! 🛍️
            </p>
            <p style="color: #666; font-size: 14px;">
              Powered by SendGrid • Deployed on Render • Built with ❤️
            </p>
          </div>
        </div>
      `,
      text: `
🎉 SendGrid Setup Complete!

Your Fashion Store email system is now configured with SendGrid and ready for production deployment on Render!

✅ What's Working:
- SendGrid SMTP connection established
- Email delivery working perfectly  
- Professional emails from your domain
- Ready for Render deployment

🚀 Next Steps:
1. Add SENDGRID_API_KEY to your Render environment variables
2. Deploy your Fashion Store to Render
3. Test user signup to confirm welcome emails work
4. Your customers will receive professional emails!

Test Time: ${new Date().toLocaleString()}
Service: SendGrid SMTP
Status: ✅ Ready for Production

🛍️ Your Fashion Store Email System is Live! 🛍️
      `
    };
    
    const info = await transporter.sendMail(testEmail);
    
    console.log("✅ Test email sent successfully!");
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Sent to: ${testEmail.to}`);
    
    console.log("\n" + "=".repeat(50));
    console.log("🎉 SENDGRID SETUP COMPLETE!");
    console.log("=".repeat(50));
    console.log("✅ SendGrid is working perfectly");
    console.log("✅ Test email delivered successfully");
    console.log("✅ Ready for Render deployment");
    
    console.log("\n🚀 Render Deployment Steps:");
    console.log("1. Go to your Render dashboard");
    console.log("2. Add environment variable:");
    console.log(`   SENDGRID_API_KEY=${process.env.SENDGRID_API_KEY}`);
    console.log("3. Deploy your Fashion Store");
    console.log("4. Test user signup functionality");
    
    console.log("\n📧 Your users will now receive:");
    console.log("• Welcome emails when they sign up");
    console.log("• Password reset codes");
    console.log("• Professional emails from hello@iyonicorp.com");
    
  } catch (error) {
    console.error("❌ SendGrid test failed:", error.message);
    
    if (error.code === 'EAUTH') {
      console.log("\n🔧 Authentication Error - Check your API key:");
      console.log("1. Make sure your SendGrid API key is correct");
      console.log("2. Verify the API key has 'Mail Send' permissions");
      console.log("3. Check if your SendGrid account is verified");
    } else if (error.message.includes('401')) {
      console.log("\n🔧 Unauthorized - API Key Issues:");
      console.log("1. Your API key might be invalid or expired");
      console.log("2. Generate a new API key in SendGrid dashboard");
      console.log("3. Make sure it starts with 'SG.'");
    } else {
      console.log("\n🔧 Troubleshooting:");
      console.log("1. Check your internet connection");
      console.log("2. Verify SendGrid service status");
      console.log("3. Try generating a new API key");
    }
  }
}

// Run the test
testSendGrid();