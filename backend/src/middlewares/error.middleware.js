const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    message =
      "Duplicate key error: " +
      Object.keys(err.keyValue || {}).join(", ") +
      " already exists.";
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    error: message,
  });
};

module.exports = errorHandler;
