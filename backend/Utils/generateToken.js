const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../src/models/userModel");
dotenv.config();

const generateToken = (id, statusCode, res, user, resMessage) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  //setting cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    resMessage,
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
    token,
  });
};

module.exports = generateToken;
