const db = require("../configs/db.config");
const bcrypt = require("bcrypt");
const jwtService = require("jsonwebtoken");
const userService = require("./user.service");

require("dotenv").config();

async function signUp(data) {
  const { password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  data.password = hashedPassword;
  return await userService.createUser(data);
}

async function signIn(credentials) {
  const { email, password } = credentials;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    const error = new Error(
      `Invalid credentials! Email or password doesn't match`
    );
    error.status = 400;
    throw error;
  }
  const isValidPassword = await isValidUserPassword(email, password);
  if (!isValidPassword) {
    const error = new Error(
      `Invalid credentials! Email or password doesn't match`
    );
    error.status = 400;
    throw error;
  }
  return user;
}

async function isValidUserPassword(email, password) {
  const query = `
    SELECT password
    FROM USER
    WHERE email="${email}"
  `;
  const [data] = await db.executeQuery(query);
  return await bcrypt.compare(password, data.password);
}

function getCookieWithJwtAccessToken(payload) {
  const token = getAccessToken(payload);
  const accessTokenCookie = `Authentication=${
    token.accessToken
  }; HttpOnly; Path=/; Secure; Max-Age=${token.expiresIn / 1000}`;
  return {
    token,
    accessTokenCookie,
  };
}

function getAccessToken(payload) {
  const accessToken = jwtService.sign(payload, process.env.VERIFICATION_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
  });
  return {
    accessToken,
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION_TIME}ms`,
  };
}

module.exports = {
  signUp,
  signIn,
  getCookieWithJwtAccessToken,
};
