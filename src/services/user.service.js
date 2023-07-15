const userService = require("../services/user.service");

async function createUser(data) {}

async function getUserById(id) {}

async function getUserByUsername(username) {}

async function getUserByEmail(email) {}

async function updateUserById(id, data) {}

async function deleteUserById(id) {}

async function resetPasswordByEmail(email) {}

async function updatePassword(credentials) {}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  resetPasswordByEmail,
  updatePassword,
  deleteUserById,
};
