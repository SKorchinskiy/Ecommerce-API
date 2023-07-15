const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter
  .use("/sign-in", authController.signIn)
  .use("/sign-up", authController.signUp)
  .use("/sign-out", authController.signOut)
  .use("/forgot", authController.resetPassword)
  .use("/update-password", authController.updatePassword);

module.exports = authRouter;
