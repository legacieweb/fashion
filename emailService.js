const nodemailer = require("nodemailer");
require("dotenv").config();
const cryptoRandomString = require("crypto-random-string");

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",  // You can use other services like Outlook, SMTP, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send email
const sendWelcomeEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: `"Iyonic Fashion" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to Iyonic Fashion!",
            html: `
                <h2>Welcome, ${name}! 🎉</h2>
                <p>Thank you for signing up at <b>Iyonic Fashion</b>.</p>
                <p>We are thrilled to have you on board!</p>
                <p>Explore our latest fashion trends and exclusive deals.</p>
                <br>
                <p>Best regards,<br><b>Iyonic Fashion Team</b></p>
            `
        });

        console.log(`Signup email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendWelcomeEmail };
async function sendResetOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendResetOTP };