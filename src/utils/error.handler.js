function errorHandler(err, req, res, next) {
  const { status, message } = err;
  return res.status(status || 500).json({
    success: false,
    message: message ?? "Internal Server Error",
  });
}

module.exports = {
  errorHandler,
};
