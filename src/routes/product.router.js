const express = require("express");
const productController = require("../controllers/product.controller");

const productRouter = express.Router();

productRouter
  .route("/:id")
  .get(productController.getProductById)
  .post(productController.createProduct)
  .put(productController.updateProductById)
  .delete(productController.deleteProductById);

module.exports = productRouter;
