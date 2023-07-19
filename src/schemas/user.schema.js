const Joi = require("joi");

const userValidationSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(30)
    .message("username field doesn't meet the requirements"),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .message("email field doesn't meet the requirements"),
  password: Joi.string()
    .min(8)
    .max(64)
    .message("password field doesn't meet the requirements"),
});

module.exports = userValidationSchema;
