const express = require("express");
const productController = require("../controllers/product.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isGrantedAccess } = require("../middlewares/role.middleware");
const { validateProductInput } = require("../middlewares/product.middleware");

const productRouter = express.Router();

const adminHandlers = [isAuthenticated(), isGrantedAccess("admin")];

productRouter.use(validateProductInput());

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(...adminHandlers, productController.createProduct);

productRouter
  .route("/:id")
  .get(productController.getProductById)
  .put(...adminHandlers, productController.updateProductById)
  .delete(...adminHandlers, productController.deleteProductById);

productRouter.route("/cart").get(productController.getProductCart);

productRouter
  .route("/cart/:id")
  .post(isAuthenticated(), productController.addProductToCart)
  .delete(isAuthenticated(), productController.dropProductFromCart);

module.exports = productRouter;
