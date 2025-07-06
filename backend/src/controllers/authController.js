const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../Utils/generateToken.js");
const nodemailer = require("nodemailer");
const resetPasswordLink = require("../../Utils/email.js");
const crypto = require("crypto");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

// @desc Register new user
// @route POST /api/auth/register
// @access Public
// const registerUser = asyncHandler(async (req, res, next) => {
//   const { name, email, password, role, confirmPassword } = req.body;
//   let avatar;

//   if (req.file) {
//     avatar = `${process.env.BACKEND_URL}/uploads/images/${req.file.filename}`;
//   }

//   if (!name || !email || !password || !confirmPassword) {
//     return next(new Error("Please add all fields"));
//   }

//   if (password !== confirmPassword) {
//     return next(new Error("Passwords do not match"));
//   }

//   // Check if user exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     if (req.file && req.file.path) {
//       fs.unlinkSync(req.file.path); // Delete uploaded avatar on error
//     }
//     return next(new Error("User already exists"));
//   }

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password,
//     avatar,
//     role,
//   });
//   const resMessage = "User created successfully";
//   if (user) {
//     res.status(201).json({
//       token: generateToken(user._id, 200, res, user, resMessage),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, confirmPassword } = req.body;

  let avatar;
  if (req.file) {
    avatar = req.file.path; // ✅ Cloudinary image URL
  }

  if (!name || !email || !password || !confirmPassword) {
    return next(new Error("Please add all fields"));
  }

  if (password !== confirmPassword) {
    return next(new Error("Passwords do not match"));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new Error("User already exists"));
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
    role,
  });

  const resMessage = "User created successfully";

  if (user) {
    res.status(201).json({
      token: generateToken(user._id, 200, res, user, resMessage),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("Please add all fields"));
  }

  // Check for user email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Error("User not found"));
  }
  const resMessage = "User LoggedIn successfully";
  if (await user.matchPassword(password)) {
    res.status(200).json({
      token: generateToken(user._id, 200, res, user, resMessage),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Logout user
// @route POST /api/auth/logout
// @access Public
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// @desc Forgot password
// @route POST /api/auth/forgot
// @access Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new Error("Please add all fields"));
  }

  // Check for user email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("User not found"));
  }

  // Generate a 64-character token
  const token = crypto.randomBytes(32).toString("hex");
  const expireDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

  user.resetPasswordToken = token;
  user.resetPasswordExpire = expireDate;
  await user.save();

  // Send reset password email with the token as link or part of URL
  await resetPasswordLink(email, user.name, token);

  res.status(200).json({
    success: true,
    message: "Password reset link sent successfully",
  });
});

// @desc Reset password
// @route POST /api/auth/reset/:token
// @access Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  if (!password || !confirmPassword) {
    return next(new Error("Please add all fields"));
  }

  if (password !== confirmPassword) {
    return next(new Error("Passwords do not match"));
  }

  if (!token) {
    return next(new Error("Token is missing"));
  }

  // Find the user by token and check expiry
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }, // token not expired
  });

  if (!user) {
    return next(new Error("Invalid or expired reset token"));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// @desc Get user Profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new Error("User not found"));
  }
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  });
});

// @desc Change password
// @route PUT /api/auth/changePassword
// @access Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new Error("Please add all fields"));
  }

  if (newPassword !== confirmPassword) {
    return next(new Error("Passwords do not match"));
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new Error("User not found"));
  }

  if (!(await user.matchPassword(oldPassword))) {
    return next(new Error("Old password is incorrect"));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// @desc Update user Profile
// @route PUT /api/auth/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  let updatedData = {
    name: req.body.name,
    email: req.body.email,
  }
   let avatar;
 if (req.file) {
   avatar = `${process.env.BACKEND_URL}/uploads/images/${req.file.filename}`;
   updatedData = {
    ...updatedData,
    avatar,
   }
 }
  const user = await User.findByIdAndUpdate(req.user.id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new Error("User not found"));
  }

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

// @desc Get All Users
// @route GET /api/auth/allProfile
// @access Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    message: "Users fetched successfully",
    users,
  });
});

// @desc Get Single User
// @route GET /api/auth/singleProfile/:id
// @access Admin
const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Error("User not found"));
  }
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

// @desc Update User
// @route PUT /api/auth/updateProfile/:id
// @access Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new Error("User not found"));
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

// @desc Delete User
// @route DELETE /api/auth/deleteProfile/:id
// @access Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new Error("User not found"));
  }
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
