const bcrypt = require("bcrypt");
const userService = require("./user.service");

async function signUp(user) {
  const { email } = user;
  const userExists = await userService.getUserByEmail(email);
  if (userExists) {
    throw new Error({
      status: 400,
      message: `The email ${email} is already in use! Please, try another email`,
    });
  }
  // create new user and store it into db
}

async function signIn(credentials) {
  const { email, password } = credentials;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error({
      status: 400,
      message: `Invalid credentials! Email or password doesn't match`,
    });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error({
      status: 400,
      message: `Invalid credentials! Email or password doesn't match`,
    });
  }
  // assign cookies to user
}

async function signOut() {
  // remove user's auth cookies
}

module.exports = {
  signUp,
  signIn,
  signOut,
};
