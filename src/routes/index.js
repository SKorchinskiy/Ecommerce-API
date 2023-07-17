const express = require("express");

const authRouter = require("./auth.router");
const userRouter = require("./user.router");

const router = express.Router();

router.use("/auth", authRouter).use("/user", userRouter);

module.exports = router;
