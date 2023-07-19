const Joi = require("joi");

const productValidationSchema = Joi.object({
  productName: Joi.string()
    .min(1)
    .max(20)
    .message("field productName doesn't meet the requirements!"),
  price: Joi.number()
    .min(0)
    .message("field price doesn't meet the requirements!"),
  quantity: Joi.number()
    .min(0)
    .message("field quantity doesn't meet the requirements!"),
}).unknown(false);

module.exports = { productValidationSchema };
