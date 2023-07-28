const express = require("express");

const orderController = require("../controllers/order.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isGrantedAccess } = require("../middlewares/role.middleware");
const { isResourceOwnerOrAdmin } = require("../middlewares/owner.middleware");

const orderRouter = express.Router();

orderRouter.use(isAuthenticated());

orderRouter
  .route("/user/:id")
  .all(isResourceOwnerOrAdmin())
  .get(orderController.getUserOrders);

orderRouter
  .route("/")
  .get(isGrantedAccess("admin"), orderController.getAllOrders)
  .post(orderController.createOrder);

orderRouter
  .route("/:id")
  .all(isGrantedAccess("admin"))
  .get(orderController.getOrderById);

module.exports = orderRouter;
