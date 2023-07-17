const express = require("express");
const productController = require("../controllers/product.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isGrantedAccess } = require("../middlewares/role.middleware");

const productRouter = express.Router();

const adminHandlers = [isAuthenticated(), isGrantedAccess("admin")];

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(...adminHandlers, productController.createProduct);

productRouter
  .route("/:id")
  .get(productController.getProductById)
  .put(...adminHandlers, productController.updateProductById)
  .delete(...adminHandlers, productController.deleteProductById);

module.exports = productRouter;
