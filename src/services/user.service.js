const fs = require("fs");
const bcrypt = require("bcrypt");
const { mysql: db } = require("../configs/db.config");
const { transaction } = require("../utils/transaction.handler");
const { getDefaultAvatarPath } = require("../utils/upload.handler");

async function createUser(data) {
  const { username, email, password } = data;
  const hashedPassword = await getEncryptedPassword(password);
  const paramsReserved = await checkUserParamsInUse({ username, email });

  if (paramsReserved) {
    const error = new Error(`User with provided parameters already exists!`);
    error.status = 400;
    throw error;
  }

  const userId = await transaction(async (trx) => {
    const [insertId] = await trx("user").insert({
      username,
      email,
      password: hashedPassword,
    });
    await assignUserRole(insertId, "user", trx);
    return insertId;
  });

  return await getUserById(userId);
}

async function checkUserExists(userId) {
  const [user] = await db("USER").where("id", userId).select("id");
  return user ? true : false;
}

async function getUserAvatarPath(userId) {
  const userExists = await checkUserExists(userId);
  if (!userExists) {
    const error = new Error("User was not found!");
    error.status = 404;
    throw error;
  }
  const [{ avatar_path }] = await db("USER")
    .select("avatar_path")
    .where("id", userId);
  return avatar_path;
}

async function uploadUserAvatar(userId, avatar) {
  await db("USER").update({ avatar_path: avatar.path }).where("id", userId);
  return await getUserAvatarPath(userId);
}

async function removeUserAvatar(userId) {
  const avatar_path = await getUserAvatarPath(userId);
  if (avatar_path === getDefaultAvatarPath()) {
    const error = new Error(`Currently, you haven't set an avatar!`);
    error.status = 400;
    throw error;
  }
  await db("USER").where("id", userId).update({
    avatar_path: getDefaultAvatarPath(),
  });
  return await getUserAvatarPath(userId);
}

async function getEncryptedPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function checkUserParamsInUse(params) {
  const [response] = await db("user").where(function () {
    Object.keys(params).forEach((key, index) => {
      const param = { [key]: params[key] };
      index ? this.orWhere(param) : this.where(param);
    });
  });
  return response ? true : false;
}

async function assignUserRole(userId, role, context = db) {
  if (!checkUserParamsInUse({ id: userId })) {
    const error = new Error(`User was not found!`);
    error.status = 404;
    throw error;
  }

  const [insertId] = await context("role").insert({ userId, role });
  return insertId;
}

async function getAllUsers({ pagination, sort }) {
  return await db("user")
    .select("id", "username", "email")
    .modify(sort)
    .modify(pagination);
}

async function getUserById(id) {
  const [user] = await db("user")
    .where("id", id)
    .select("id", "username", "email");

  if (!user) {
    const error = new Error(`User was not found!`);
    error.status = 404;
    throw error;
  }

  return user;
}

async function getUserByUsername(username) {
  const [user] = await db("user")
    .where("username", username)
    .select("id", "username", "email");

  if (!user) {
    const error = new Error(`User with provided username was not found!`);
    error.status = 404;
    throw error;
  }

  return user;
}

async function getUserByEmail(email) {
  const [user] = await db("user")
    .where("email", email)
    .select("id", "username", "email");

  if (!user) {
    const error = new Error(`User with provided email was not found!`);
    error.status = 404;
    throw error;
  }

  return user;
}

async function getUserRoles(userId) {
  const data = await db("role").where("userId", userId).select("role");
  const roles = data.map((roleObj) => roleObj.role);
  return roles;
}

async function updateUserById(id, data) {
  const paramsReserved = await checkUserParamsInUse(data);
  if (paramsReserved) {
    const error = new Error("User with provided parameters already exists!");
    error.status = 400;
    throw error;
  }
  await db("user").where("id", id).update(data);
  return await getUserById(id);
}

async function deleteUserById(id) {
  const user = await getUserById(id);
  await db("user").where("id", id).del("");
  return user;
}

module.exports = {
  createUser,
  getUserAvatarPath,
  uploadUserAvatar,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getUserRoles,
  updateUserById,
  removeUserAvatar,
  deleteUserById,
};
