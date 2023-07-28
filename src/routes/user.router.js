const express = require("express");
const userController = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isGrantedAccess } = require("../middlewares/role.middleware");
const { validateUserInput } = require("../middlewares/user.middleware");
const { isResourceOwnerOrAdmin } = require("../middlewares/owner.middleware");

const userRouter = express.Router();

userRouter.use(isAuthenticated());

userRouter
  .route("/")
  .get(isGrantedAccess("admin"), userController.getAllUsers)
  .post(validateUserInput(), userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getUserById)
  .put(
    isResourceOwnerOrAdmin(),
    validateUserInput(),
    userController.updateUserById
  )
  .delete(isResourceOwnerOrAdmin(), userController.deleteUserById);

userRouter
  .route("/email/:email")
  .all(isGrantedAccess("admin"))
  .get(userController.getUserByEmail);

userRouter.route("/username/:username").get(userController.getUserByUsername);

module.exports = userRouter;
