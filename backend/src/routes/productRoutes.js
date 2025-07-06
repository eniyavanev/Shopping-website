const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteSingleProduct,
  createProductReview,
  getSingleProductReviews,
  deleteReview,
  getProductsAdmin,
} = require("../controllers/productController.js");
const express = require("express");
const { checkToken, isAdmin } = require("../middleware/tokenAuthentication.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = require("../middleware/uploadMiddleware.js");
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname, "../../uploads/products"));
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

//Admin routes
router
  .route("/admin/create")
  .post(checkToken, isAdmin("admin"), upload.array("images"), createProduct);
router
  .route("/admin/update/:id")
  .put(checkToken, isAdmin("admin"), upload.array("images"), updateProduct);
router
  .route("/admin/delete/:id")
  .delete(checkToken, isAdmin("admin"), deleteSingleProduct);
router
  .route("/admin/Reviews")
  .delete(checkToken, isAdmin("admin"), deleteReview);
router
  .route("/admin/Reviews")
  .get(checkToken, isAdmin("admin"), getSingleProductReviews);

router
  .route("/admin/products")
  .get(checkToken, isAdmin("admin"), getProductsAdmin);

//public routes
router.route("/get").get(getProducts);
router.route("/get/:id").get(getSingleProduct);

router
  .route("/review")
  .put(checkToken, createProductReview)
  .get(checkToken, getSingleProductReviews);

module.exports = router;
