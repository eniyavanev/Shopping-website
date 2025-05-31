const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteSingleProduct,
  createProductReview,
  getSingleProductReviews,
  deleteReview,
  getProductsAdmin
} = require("../controllers/productController.js");
const express = require("express");
const { checkToken, isAdmin } = require("../middleware/tokenauthentication.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../uploads/products"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
})

//Admin routes
router.route("/admin/create").post(checkToken, isAdmin("admin"),upload.array("images"), createProduct);

router
  .route("/admin/products")
  .get(checkToken, isAdmin("admin"), getProductsAdmin);

router.route("/get").get( getProducts);
router.route("/get/:id").get(getSingleProduct);
router.route("/update/:id").put(updateProduct);
router.route("/delete/:id").delete(deleteSingleProduct);
router
  .route("/review")
  .put(checkToken, createProductReview)
  .get(checkToken, getSingleProductReviews).delete(checkToken, deleteReview);

module.exports = router;
