const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteSingleProduct,
  createProductReview,
  getSingleProductReviews,
  deleteReview,
} = require("../controllers/productController.js");
const express = require("express");
const { checkToken, isAdmin } = require("../middleware/tokenauthentication.js");
const router = express.Router();
//Admin routes
router.route("admin/create").post(checkToken, isAdmin("admin"), createProduct);

router.route("/get").get( getProducts);
router.route("/get/:id").get(getSingleProduct);
router.route("/update/:id").put(updateProduct);
router.route("/delete/:id").delete(deleteSingleProduct);
router
  .route("/review")
  .put(checkToken, createProductReview)
  .get(checkToken, getSingleProductReviews).delete(checkToken, deleteReview);

module.exports = router;
