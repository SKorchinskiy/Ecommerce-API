const userService = require("./user.service");
const productService = require("./product.service");
const { mysql: db } = require("../configs/db.config");

async function getProductReviews(productId, { pagination, sort }) {
  const reviewsData = await db
    .from(db.raw("PRODUCT_REVIEW as PR"))
    .join(db.raw("USER as U"), "U.id", "PR.customerId")
    .where("productId", productId)
    .select(
      "PR.customerId",
      "U.username",
      "U.email",
      "PR.rating",
      "PR.description",
      "PR.advantages",
      "PR.disadvantages",
      "PR.updated_at"
    )
    .modify(sort)
    .modify(pagination);

  const reviews = reviewsData.map((reviewData) => {
    const {
      customerId,
      username,
      email,
      rating,
      description,
      advantages,
      disadvantages,
      updated_at,
    } = reviewData;
    const customer = { customerId, username, email };
    return {
      customer,
      rating,
      description,
      advantages,
      disadvantages,
      updated_at,
    };
  });

  return reviews;
}

async function getCustomerReviewOnProduct(customerId, productId) {
  const existsCustomerReview = await existsCustomerReviewOnProduct(
    customerId,
    productId
  );
  if (!existsCustomerReview) {
    const error = new Error(`You haven't left a review on the product yet!`);
    error.status = 400;
    throw error;
  }
  const [review] = await db("PRODUCT_REVIEW")
    .select(
      "rating",
      "description",
      "advantages",
      "disadvantages",
      "updated_at"
    )
    .where(function () {
      this.where("productId", productId).andWhere("customerId", customerId);
    });

  const [customer] = await db("USER")
    .select("id", "username", "email")
    .where("id", customerId);

  return { customer, ...review };
}

async function existsCustomerReviewOnProduct(customerId, productId) {
  const [review] = await db("PRODUCT_REVIEW")
    .where("customerId", customerId)
    .andWhere("productId", productId);
  return review ? true : false;
}

async function createProductReview(productId, customerId, data) {
  const existsCustomerReview = await existsCustomerReviewOnProduct(
    customerId,
    productId
  );
  if (existsCustomerReview) {
    const error = new Error(`You have already left a review on the product!`);
    error.status = 400;
    throw error;
  }
  const { rating, description, advantages, disadvantages } = data;

  await db("PRODUCT_REVIEW").insert({
    productId,
    customerId,
    rating,
    description,
    advantages,
    disadvantages,
  });

  return await getCustomerReviewOnProduct(customerId, productId);
}

async function updateCustomerReview(customerId, productId, data) {
  const existsCustomerReview = await existsCustomerReviewOnProduct(
    customerId,
    productId
  );
  if (!existsCustomerReview) {
    const error = new Error(`You haven't left a review on the product yet!`);
    error.status = 400;
    throw error;
  }
  await db("PRODUCT_REVIEW")
    .update(data)
    .where("productId", productId)
    .andWhere("customerId", customerId);
  return await getCustomerReviewOnProduct(customerId, productId);
}

async function removeCustomerReview(customerId, productId) {
  const review = await getCustomerReviewOnProduct(customerId, productId);
  await db("PRODUCT_REVIEW")
    .del()
    .where("customerId", customerId)
    .andWhere("productId", productId);
  return review;
}

module.exports = {
  getProductReviews,
  createProductReview,
  updateCustomerReview,
  removeCustomerReview,
};
