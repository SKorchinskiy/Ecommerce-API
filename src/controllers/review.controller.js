const queryUtils = require("../utils/query.handler");
const reviewService = require("../services/review.service");

async function getProductReviews(req, res, next) {
  try {
    const snippets = queryUtils.getQuerySnippets(req.query);
    const productId = +req.params.productId;
    const reviews = await reviewService.getProductReviews(productId, snippets);
    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}

async function createProductReview(req, res, next) {
  try {
    const productId = +req.params.productId;
    const customerId = +req.user.id;
    const data = req.body;
    const review = await reviewService.createProductReview(
      productId,
      customerId,
      data
    );
    return res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCustomerReview(req, res, next) {
  try {
    const customerId = +req.user.id;
    const productId = +req.params.productId;
    const data = req.body;
    const review = await reviewService.updateCustomerReview(
      customerId,
      productId,
      data
    );
    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
}

// update for admin to be able to remove reviews
async function removeCustomerReview(req, res, next) {
  try {
    const customerId = +req.user.id;
    const productId = +req.params.productId;
    const review = await reviewService.removeCustomerReview(
      customerId,
      productId
    );
    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProductReviews,
  createProductReview,
  updateCustomerReview,
  removeCustomerReview,
};
