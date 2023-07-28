const Joi = require("joi");
const { mysql: db } = require("../configs/db.config");
const { productValidationSchema } = require("../schemas/product.schema");

function validateProductInput() {
  return (req, res, next) => {
    try {
      const data = req.body;
      Joi.assert(data, productValidationSchema);
      next();
    } catch (error) {
      const message = error?.details[0]?.message;
      return res.status(400).json({
        success: false,
        message: `Invalid input format! ${message}`,
      });
    }
  };
}

function checkUserOrderedProduct() {
  return async (req, res, next) => {
    try {
      const productId = +req.params.productId;
      const customerId = +req.user.id;
      const [productOrders] = await db
        .from(db.raw("ORDER_DETAILS as OD"))
        .join(db.raw("ORDER_PRODUCT as OP"), "OD.id", "OP.orderId")
        .groupBy(db.raw("OD.customerId, OP.productId"))
        .where("OP.productId", productId)
        .andWhere("OD.customerId", customerId)
        .select(db.raw("COUNT(*)"));
      const orderCount = productOrders ? productOrders[`COUNT(*)`] ?? 0 : 0;
      if (!orderCount) {
        const error = new Error(
          `Access forbidden! You haven't ordered the product yet!`
        );
        error.status = 403;
        throw error;
      }
      next();
    } catch (error) {
      const { status, message } = error;
      return res.status(500).json({
        success: false,
        message: message,
      });
    }
  };
}

module.exports = {
  validateProductInput,
  checkUserOrderedProduct,
};
