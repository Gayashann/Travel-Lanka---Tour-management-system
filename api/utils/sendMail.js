import nodemailer from "nodemailer";

export default async function sendMail({ to, subject, text }) {
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
  };

  await transporter.sendMail(mailOptions);

  console.log("Email sent");
}
