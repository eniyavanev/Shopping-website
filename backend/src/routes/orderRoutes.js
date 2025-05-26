const express = require("express");
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController.js");
const { checkToken, isAdmin } = require("../middleware/tokenAuthentication.js");
const router = express.Router();

router.route("/create").post(checkToken, createOrder);

router.route("/get/:id").get(checkToken, getSingleOrder);

router.route("/myOrders").get(checkToken, myOrders);

//Admin routes
router
  .route("/admin/allOrders")
  .get(checkToken, isAdmin("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(checkToken, isAdmin("admin"), updateOrder)
  .delete(checkToken, isAdmin("admin"), deleteOrder);

module.exports = router;
