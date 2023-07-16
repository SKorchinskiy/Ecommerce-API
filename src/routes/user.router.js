const express = require("express");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUserById)
  .delete(userController.deleteUserById);

userRouter.route("/email/:email").get(userController.getUserByEmail);

userRouter.route("/username/:username").get(userController.getUserByUsername);

module.exports = userRouter;
