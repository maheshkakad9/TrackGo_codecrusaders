const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendPasswordEmail = async (to, password) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Account Password',
    html: `
      <h3>Welcome to SmartReimburse</h3>
      <p>Your temporary password is:</p>
      <h2>${password}</h2>
      <p>Please login and change your password immediately.</p>
    `
  });
};