const productService = require("../services/product.service");
const orderService = require("../services/order.service");
const { transaction } = require("../utils/transaction.handler");
const queryUtils = require("../utils/query.handler");

async function getAllOrders(req, res, next) {
  try {
    const params = queryUtils.getPagination(req.query);
    const orders = await orderService.getAllOrders(params);
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const orderId = +req.params.id;
    const order = await orderService.getOrderById(orderId);
    return res.status(200).json({
      success: 200,
      order,
    });
  } catch (error) {
    next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const userId = +req.user.id;
    const cart = await productService.getProductCart(userId);
    const order = await transaction(async (trx) => {
      const order = await orderService.createOrder(userId, cart, trx);
      await productService.clearProductCart(userId);
      return order;
    });
    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
};
