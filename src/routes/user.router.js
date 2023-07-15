const express = require("express");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/user").post(userController.createUser);

userRouter
  .route("/user/:id")
  .get(userController.getUserById)
  .put(userController.updateUserById)
  .delete(userController.deleteUserById);

userRouter.route("/user/email/:email").get(userController.getUserByEmail);

userRouter
  .route("/user/username/:username")
  .get(userController.getUserByUsername);

module.exports = userRouter;
