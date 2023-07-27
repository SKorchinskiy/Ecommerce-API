const express = require("express");

const orderController = require("../controllers/order.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isGrantedAccess } = require("../middlewares/role.middleware");

const orderRouter = express.Router();

orderRouter.use(isAuthenticated(), isGrantedAccess("admin"));

orderRouter
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

orderRouter.route("/:id").get(orderController.getOrderById);

module.exports = orderRouter;
