const ejs = require("ejs");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587, // this port for gmail
  secure: false, // true for 465, false for other ports because gmail is not using 465
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PWD,
  },
});
const resetPasswordLink = async (email, name, token) => {
  // Now you can directly use __dirname in CommonJS
  const currentDirectory = __dirname;

  // Example usage
 // console.log("Current directory:", currentDirectory);

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Password Reset Link",
  };

  try {
    const templatePath = path.join(
      currentDirectory,
      "../Template/reset_pwd.ejs"
    );
    const htmlContent = await ejs.renderFile(templatePath, { name, token });
    mailOptions.html = htmlContent;
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = resetPasswordLink;
