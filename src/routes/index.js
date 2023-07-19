const express = require("express");

const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const productRouter = require("./product.router");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/product", productRouter);

module.exports = router;
