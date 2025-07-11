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
  const isPaid = paymentInfo?.status === "succeeded";
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt: paymentInfo?.status === "succeeded" ? Date.now() : null,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
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
  console.log(req.body);

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const { orderStatus } = req.body;

  if (!orderStatus) {
    return res
      .status(400)
      .json({ success: false, message: "Order status is required" });
  }

  if (order.orderStatus === "Delivered") {
    return res.status(400).json({
      success: false,
      message: "You have already delivered this order",
    });
  }

  // Reduce stock for each product in the order
  for (const item of order.orderItems) {
    //console.log("item",item);

    await updateStock(item._id, item.quantity);
  }

  order.orderStatus = orderStatus;

  if (orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    order,
  });

  // Helper function to update stock
  async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(`Product not found with ID: ${productId}`);
    }
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

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = "Delivered";

  const updatedOrder = await order.save();
  res.status(200).json({ success: true, order: updatedOrder });
});


module.exports = {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  markOrderAsPaid
};
