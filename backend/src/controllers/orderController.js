const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");

//@desc Create new order
// @route POST /api/orders/create
// @access User
const createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(), // oder create panra time
    user: req.user._id, // order panra user id
  });
  res
    .status(201)
    .json({ success: true, message: "Order created successfully", order });
});

//@desc Get single order
// @route GET /api/orders/:id
// @access User
const getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user", // user id panra user info
    "name email" // user info panra name and email
  );
  if (!order) {
    return next(new Error("Order not found"));
  }
  res
    .status(200)
    .json({ success: true, message: "Order fetched successfully", order });
});

//@desc Get Logging user orders
// @route GET /api/orders/me
// @access User
const myOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res
    .status(200)
    .json({ success: true, message: "Orders fetched successfully", orders });
});

// @desc Admin get all orders
// @route GET /api/admin/orders
// @access Admin
const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    message: "Orders fetched successfully",
    orders,
  });
});

// @desc Admin update order status
// @route PUT /api/admin/order/:id
// @access Admin
const updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!req.body.orderStatus) {
    return res
      .status(400)
      .json({ success: false, message: "Order status is required" });
  }

  if (!order) {
    return next(new Error("Order not found"));
  }

  if (order.orderStatus === "Delivered") {
    return next(new Error("You have already delivered this order"));
  }

  // ✅ use for...of instead of forEach
  for (const item of order.orderItems) {
    await updateStock(item.product, item.quantity);
  }

  order.orderStatus = req.body.orderStatus;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    order,
  });

  // 🔧 inner function
  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
});

// @desc Admin delete order
// @route DELETE /api/admin/order/:id
// @access Admin
const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new Error("Order not found"));
  }
  res
    .status(200)
    .json({ success: true, message: "Order deleted successfully" });
});

module.exports = {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
