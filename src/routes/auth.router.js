const express = require("express");
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.route("/sign-in").post(authController.signIn);

authRouter.route("/sign-up").post(authController.signUp);

authRouter.route("/sign-out").all(isAuthenticated).post(authController.signOut);

authRouter.route("/forgot").post(authController.resetPassword);

module.exports = authRouter;
