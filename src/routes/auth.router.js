const express = require("express");
const authController = require("../controllers/auth.controller");
const {
  isAuthenticated,
  validateLogIn,
  validateRegistration,
} = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.route("/sign-in").post(validateLogIn(), authController.signIn);

authRouter
  .route("/sign-up")
  .post(validateRegistration(), authController.signUp);

authRouter
  .route("/sign-out")
  .all(isAuthenticated())
  .post(authController.signOut);

authRouter.route("/forgot").post(authController.resetPassword);

module.exports = authRouter;
