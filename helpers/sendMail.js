import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const sendMail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_HOST_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  return transporter.sendMail(mailOptions);
};

export default sendMail;