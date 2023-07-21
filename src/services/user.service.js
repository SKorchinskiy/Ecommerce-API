const bcrypt = require("bcrypt");
const { mysql: db } = require("../configs/db.config");

async function createUser(data) {
  const { username, email, password } = data;
  const hashedPassword = await getEncryptedPassword(password);
  const paramsReserved = await checkUserParamsInUse({ username, email });
  if (paramsReserved) {
    const error = new Error(`User with provided parameters already exists!`);
    error.status = 400;
    throw error;
  }
  const [insertId] = await db("user").insert({
    username,
    email,
    password: hashedPassword,
  });
  await assignUserRole(insertId, "user");
  return await getUserById(insertId);
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

async function assignUserRole(userId, role) {
  if (!checkUserParamsInUse({ id: userId })) {
    const error = new Error(`User was not found!`);
    error.status = 404;
    throw error;
  }

  const [insertId] = await db("role").insert({ userId, role });
  return insertId;
}

async function getAllUsers() {
  return await db("user").select("id", "username", "email");
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
  const query = `
    SELECT id, username, email 
    FROM USER 
    WHERE email="${email}"
  `;
  const [user] = await db.executeQuery(query);
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
  // const exists = await checkUserExists(data);
  if (exists) {
    const error = new Error("User with provided params already exists!");
    error.status = 400;
    throw error;
  }
  await Promise.all(
    Object.keys(data).map(async (key) => {
      const query = `
        UPDATE USER
        SET ${key}="${data[key]}"
        WHERE id=${id}
      `;
      await db.executeQuery(query);
    })
  );
  const user = await getUserById(id);
  return user;
}

async function deleteUserById(id) {
  const query = `
    DELETE 
    FROM USER
    WHERE id=${id}
  `;
  const user = await getUserById(id);
  await db.executeQuery(query);
  return user;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getUserRoles,
  updateUserById,
  deleteUserById,
};
