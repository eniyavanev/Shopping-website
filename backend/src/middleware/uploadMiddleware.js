// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const cloudinary = require("../../config/cloudinaryConfig.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shoppingWebsite", // cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;


