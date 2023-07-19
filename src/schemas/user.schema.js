const joi = require("joi");

const userValidationSchema = joi.object({
  username: joi
    .string()
    .min(1)
    .max(30)
    .message("username field doesn't meet the requirements"),
  email: joi
    .string()
    .email({ minDomainSegments: 2 })
    .message("email field doesn't meet the requirements"),
  password: joi
    .string()
    .min(8)
    .max(64)
    .message("password field doesn't meet the requirements"),
});

module.exports = userValidationSchema;
