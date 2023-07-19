const Joi = require("joi");

const signInValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .message("email field doesn't meet the requirements")
    .required(),
  password: Joi.string()
    .min(8)
    .max(64)
    .message("password field doesn't meet the requirements")
    .required(),
});

const signUpValidationSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(30)
    .message("username field doesn't meet the requirements")
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .message("email field doesn't meet the requirements")
    .required(),
  password: Joi.string()
    .min(8)
    .max(64)
    .message("password field doesn't meet the requirements")
    .required(),
});

module.exports = {
  signInValidationSchema,
  signUpValidationSchema,
};
