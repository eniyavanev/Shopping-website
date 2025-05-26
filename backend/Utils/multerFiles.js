const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const allowedFiles = ["image/jpeg", "image/png", "image/jpg"];

const fileFilter = (req, file, cb) => {
  if (!allowedFiles.includes(file.mimetype)) {
    const err = multer.MulterError("LIMIT_UNEXPECTED_FILE");
    err.message = "File type not allowed";
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

module.exports = upload;
