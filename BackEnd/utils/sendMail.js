const nodemailer = require("nodemailer");

async function sendMail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "travellanka247@gmail.com",
      pass: "rldy yxcj czkz prko",
    },
  });

  const mailOptions = {
    from: "travellanka247@gmail.com",
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);

  console.log("Email sent successfully");
}

module.exports = sendMail;
