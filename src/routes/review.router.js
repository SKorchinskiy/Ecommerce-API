const express = require("express");

const reviewController = require("../controllers/review.controller");
const {
  checkUserOrderedProduct,
} = require("../middlewares/product.middleware");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route("/")
  .get(reviewController.getProductReviews)
  .post(checkUserOrderedProduct(), reviewController.createProductReview)
  .put(reviewController.updateCustomerReview)
  .delete(reviewController.removeCustomerReview);

module.exports = reviewRouter;
