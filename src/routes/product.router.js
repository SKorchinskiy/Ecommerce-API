const express = require("express");
const productController = require("../controllers/product.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isGrantedAccess } = require("../middlewares/role.middleware");
const { validateProductInput } = require("../middlewares/product.middleware");

const productRouter = express.Router();

productRouter.use(isAuthenticated());

productRouter.route("/cart").get(productController.getProductCart);

productRouter
  .route("/cart/:id")
  .post(productController.addProductToCart)
  .delete(productController.dropProductFromCart);

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(
    isGrantedAccess("admin"),
    validateProductInput(),
    productController.createProduct
  );

productRouter
  .route("/:id")
  .get(productController.getProductById)
  .put(
    isGrantedAccess("admin"),
    validateProductInput(),
    productController.updateProductById
  )
  .delete(
    isGrantedAccess("admin"),
    validateProductInput(),
    productController.deleteProductById
  );

module.exports = productRouter;
