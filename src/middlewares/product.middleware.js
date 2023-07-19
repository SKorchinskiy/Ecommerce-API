const Joi = require("joi");
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

module.exports = {
  validateProductInput,
};
