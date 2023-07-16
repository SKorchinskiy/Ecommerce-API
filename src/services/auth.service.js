const bcrypt = require("bcrypt");
const userService = require("./user.service");

async function signUp(data) {
  const { password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  data.password = hashedPassword;
  console.log(data);
  return await userService.createUser(data);
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
