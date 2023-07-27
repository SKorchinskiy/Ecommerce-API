const express = require("express");
const productController = require("../controllers/product.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isGrantedAccess } = require("../middlewares/role.middleware");
const { validateProductInput } = require("../middlewares/product.middleware");

const productRouter = express.Router();

productRouter.use(
  isAuthenticated(),
  isGrantedAccess("admin"),
  validateProductInput()
);

productRouter.route("/cart").get(productController.getProductCart);

productRouter
  .route("/cart/:id")
  .post(isAuthenticated(), productController.addProductToCart)
  .delete(isAuthenticated(), productController.dropProductFromCart);

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

productRouter
  .route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProductById)
  .delete(productController.deleteProductById);

module.exports = productRouter;
