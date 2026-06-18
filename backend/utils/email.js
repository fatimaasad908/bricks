import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const verifyUrl = `http://localhost:${process.env.PORT || 5000}/api/auth/verify/${token}`;

    const info = await transporter.sendMail({
      from: `"Bricks Auth Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}" target="_blank">Verify Email</a>
        <p>Or copy and paste this link in your browser: <br> ${verifyUrl}</p>
      `
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

export default sendVerificationEmail;