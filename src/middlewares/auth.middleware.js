const jwtService = require("jsonwebtoken");
const userService = require("../services/user.service");
const Joi = require("joi");
const {
  signInValidationSchema,
  signUpValidationSchema,
} = require("../schemas/auth.schema");

require("dotenv").config();

function isAuthenticated() {
  return async (req, res, next) => {
    try {
      const { Authentication } = req.cookies;
      if (!Authentication) {
        return res.status(401).json({
          success: false,
          message: `Access denied! Please, authenticate!`,
        });
      }
      const { username } = jwtService.verify(
        Authentication,
        process.env.VERIFICATION_TOKEN
      );
      const user = await userService.getUserByUsername(username);
      req.user = user;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Invalid token! ${error.message}`,
      });
    }
  };
}

function validateLogIn() {
  return (req, res, next) => {
    try {
      const data = req.body;
      Joi.assert(data, signInValidationSchema);
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

function validateRegistration() {
  return (req, res, next) => {
    try {
      const data = req.body;
      Joi.assert(data, signUpValidationSchema);
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
  isAuthenticated,
  validateLogIn,
  validateRegistration,
};
