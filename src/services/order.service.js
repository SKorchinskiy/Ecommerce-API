const { mysql: db } = require("../configs/db.config");

async function getAllOrders({ offset, limit }) {
  const orders = await db("ORDER_DETAILS")
    .select("id", "customerId", "totalPrice", "updatedAt")
    .offset(offset)
    .limit(limit);
  return orders;
}

async function getOrderById(id) {
  const order = await db("ORDER_DETAILS")
    .select("id", "customerId", "totalPrice", "updatedAt")
    .where("id", id);
  return order;
}

async function createOrder(userId, cart, context = db) {
  const { totalPrice, products } = cart;
  if (!products.length) {
    const error = new Error("Add product to the cart to make an order!");
    error.status = 400;
    throw error;
  }
  const [insertId] = await context("ORDER_DETAILS").insert({
    customerId: userId,
    totalPrice,
  });
  await updateOrderProducts(insertId, products, context);
  return await getOrderById(insertId);
}

async function updateOrderProducts(orderId, products, context = db) {
  for await (const product of products) {
    const { productId, quantity, price } = product;
    await context("ORDER_PRODUCT").insert({
      orderId,
      productId,
      quantity,
      price,
    });
  }
  return 1;
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
};
