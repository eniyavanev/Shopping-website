const express = require("express");
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  markOrderAsPaid,
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
  .route("/admin/:id")
  .put(checkToken, isAdmin("admin"), updateOrder)
  .delete(checkToken, isAdmin("admin"), deleteOrder);

router
  .route("/admin/orderIsPaid/:id")
  .put(checkToken, isAdmin("admin"), markOrderAsPaid);

module.exports = router;
