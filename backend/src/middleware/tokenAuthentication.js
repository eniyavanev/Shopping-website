const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const dotenv = require("dotenv");
dotenv.config();

const checkToken = asyncHandler(async (req, res, next) => {
  let { token } = req.cookies;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      // console.log("req.user",req.user);
      // console.log("req.user.id",req.user.id);
      // console.log("req.user._id",req.user._id);
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    next(new Error("Login to access this page"));
  }
});

// const isAdmin = (req, res, next) => {
  // if (req.user && req.user.role === "admin") {
    // next();
  // } else {
    // res.status(401).json({ success: false, message: "Not authorized as an admin" });
  // }
// };

const isAdmin =(...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(401).json({ success: false, message: `Role: ${req.user.role} is not allowed to access this Page` });
    }
  } 

}


module.exports = { checkToken, isAdmin };
