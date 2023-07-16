const jwtService = require("jsonwebtoken");
const userService = require("../services/user.service");

require("dotenv").config();

async function isAuthenticated(req, res, next) {
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
}

module.exports = {
  isAuthenticated,
};
