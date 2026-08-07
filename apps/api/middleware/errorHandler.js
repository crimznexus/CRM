/**
 * Global Express Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  // Log full error in console for debugging
  console.error("❌ Operational Error:", err);

  // Handle Sequelize validation errors cleanly
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      message: "Validation Error",
      errors: messages,
    });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || "Something went wrong on the server.";

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;