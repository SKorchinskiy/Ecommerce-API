const userService = require("../services/user.service");
const queryUtils = require("../utils/query.handler");

async function createUser(req, res) {
  try {
    const userData = req.body;
    const result = await userService.createUser(userData);
    return res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const snippets = queryUtils.getQuerySnippets(req.query);
    const users = await userService.getAllUsers(snippets);
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function getUserByUsername(req, res) {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function updateUserById(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await userService.updateUserById(id, data);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function deleteUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.deleteUserById(id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
