const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const router = require("./routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "localhost",
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

app.use("/api/v1", router);

app.all("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: `The path ${req.path} was not found`,
  });
});

module.exports = app;
