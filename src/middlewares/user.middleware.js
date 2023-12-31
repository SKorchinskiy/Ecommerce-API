const Joi = require("joi");
const userValidationSchema = require("../schemas/user.schema");

function validateUserInput() {
  return (req, res, next) => {
    try {
      const data = req.body;
      Joi.assert(data, userValidationSchema);
      next();
    } catch (error) {
      const message = error?.details[0]?.message;
      return res.status(400).json({
        success: false,
        message: `Invalid input format! ${message ?? ""}`,
      });
    }
  };
}

module.exports = { validateUserInput };
