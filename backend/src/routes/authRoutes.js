const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../uploads/images"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
})
const {
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
} = require("../controllers/authController.js");
const express = require("express");
const { checkToken, isAdmin } = require("../middleware/tokenauthentication.js");
const router = express.Router();

// routes
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/forgot").post(forgotPassword);
router.route("/reset/:token").put(resetPassword);
router
  .route("/profile")
  .get(checkToken, getUserProfile)
  .put(checkToken,upload.single("avatar"), updateUserProfile);
router.route("/changePassword").put(checkToken, changePassword);

// Admin routes
router.route("/admin/profile").get(checkToken, isAdmin("admin"), getAllUsers);
router
  .route("/admin/profile/:id")
  .get(checkToken, isAdmin("admin"), getSingleUser)
  .put(checkToken, isAdmin("admin"), updateUser)
  .delete(checkToken, isAdmin("admin"), deleteUser);

module.exports = router;
