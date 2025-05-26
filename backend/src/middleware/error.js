const dotenv = require("dotenv");
dotenv.config();

// Middleware for handling 404 (Not Found) errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (errorHandler)
};

// General error handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  let message = err.message || "Internal Server Error";

  // Validation errors from Mongoose
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    res.status(400);
  }

  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
    res.status(400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "JSON Web Token is invalid";
    res.status(401);
  }

  if (err.name === "TokenExpiredError") {
    message = "JSON Web Token is expired";
    res.status(401);
  }

  // CastError for invalid ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found";
    res.status(404);
  }

  res.json({
    success: false,
    message,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
