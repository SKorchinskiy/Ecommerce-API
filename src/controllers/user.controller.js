const userService = require("../services/user.service");

async function createUser(req, res) {
  try {
    const userData = req.body;
    return await userService.createUser(userData);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.body;
    return await userService.getUserById(id);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function getUserByUsername(req, res) {
  try {
    const { username } = req.body;
    return await userService.getUserByUsername(username);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.body;
    return await userService.getUserByEmail(email);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function updateUserById(req, res) {
  try {
    const { id, ...data } = req.body;
    return await userService.updateUserById(id, data);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function deleteUserById(req, res) {
  try {
    const { id } = req.body;
    return await userService.deleteUserById(id);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
