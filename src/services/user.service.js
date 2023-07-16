const db = require("../configs/db.config");

async function createUser(data) {
  const { username, email, password } = data;
  const query = `
    INSERT INTO USER (username, email, password) 
    VALUES("${username}", "${email}", "${password}")
  `;
  const user = getUserByUsername(username) || getUserById(email);
  if (user) {
    const error = new Error(
      `User with provided email or username already exists!`
    );
    error.status = 400;
    throw error;
  }
  const { insertId } = await db.executeQuery(query);
  return await getUserById(insertId);
}

async function getAllUsers() {
  const query = `
    SELECT id, username, email FROM USER
  `;
  return await db.executeQuery(query);
}

async function getUserById(id) {
  const query = `
    SELECT id, username, email 
    FROM USER 
    WHERE id=${id}
  `;
  const [user] = await db.executeQuery(query);
  if (!user) {
    const error = new Error(`User with provided id was not found!`);
    error.status = 404;
    throw error;
  }
  return user;
}

async function getUserByUsername(username) {
  const query = `
    SELECT id, username, email 
    FROM USER 
    WHERE username="${username}"
  `;
  const [user] = await db.executeQuery(query);
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

async function updateUserById(id, data) {
  const params = Object.keys(data).reduce((accumulate, key, index) => {
    return (accumulate += (index ? ", " : "") + `${key}="${data[key]}"`);
  }, "");
  const query = `
  UPDATE USER
  SET ${params}
  WHERE id=${id}
  `;
  const user = await getUserById(id);
  await db.executeQuery(query);
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
  updateUserById,
  deleteUserById,
};
