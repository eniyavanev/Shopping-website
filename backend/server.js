const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/connectMongoDB/connectDB.js");
const productRoutes = require("./src/routes/productRoutes.js");
const { errorHandler, notFound } = require("./src/middleware/error.js");
const authRoutes = require("./src/routes/authRoutes.js");
const orderRoutes = require("./src/routes/orderRoutes.js");
const cookieParser = require("cookie-parser");
const path = require("path");
const payment = require("./src/routes/paymentRoutes.js");

dotenv.config();
//Shopping-Mart-06-06-2025

// connect to database
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// For Stripe webhook or any raw body route — BEFORE express.json()
app.use("/api/payment/webhook", express.raw({ type: "*/*" }));

// Now add the global middlewares
app.use(express.json()); // ✅ Parse JSON globally

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("hello world");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", payment);

// error middleware
app.use(notFound);
app.use(errorHandler);

// listen
const server = app.listen(process.env.PORT, (req, res) => {
  console.log(
    `server is running on port ${process.env.PORT} and env is ${process.env.NODE_ENV}`
  );
});

// handle unhandled promise rejections, on is a listener function
//then .catch, or try catch use pannalana athu oru unhandled rejection error
//server stop aagurathukku munnadi error show pannitu shutdiwn panrom
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => process.exit(1));
});

// handle uncaught exceptions -  munnadi error show pannitu shutdiwn panrom
// throw , undefined, null ithellam try catch use pannalama error varum
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  server.close(() => process.exit(1));
});
