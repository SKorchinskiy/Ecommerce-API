const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");

const app = express();

app.use(helmet());
app.use(morgan("dev"));

app.all("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: `The path ${req.path} was not found`,
  });
});

module.exports = app;
