const db = require("../configs/db.config");
const bcrypt = require("bcrypt");

async function createUser(data) {
  const { username, email, password } = data;
  const hashedPassword = await getEncryptedPassword(password);
  const query = `
    INSERT INTO USER (username, email, password) 
    VALUES("${username}", "${email}", "${hashedPassword}")
  `;
  const user = await checkUserExists([{ username }, { email }]);
  if (user) {
    const error = new Error(
      `User with provided email or username already exists!`
    );
    error.status = 400;
    throw error;
  }
  const { insertId } = await db.executeQuery(query);
  await assignUserRoles(insertId, "user");
  return await getUserById(insertId);
}

async function getEncryptedPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function assignUserRoles(userId, ...roles) {
  if (!checkUserExists({ id: userId })) {
    const error = new Error(`User with provided id was not found!`);
    error.status = 404;
    throw error;
  }
  const values = roles.map((role, index) => {
    return (index ? "," : "") + `VALUES ("${userId}", "${role}")`;
  });
  const query = `
    INSERT INTO ROLE (userId, role)
    ${values}
  `;
  await db.executeQuery(query);
}

async function checkUserExists(search) {
  if (Array.isArray(search)) {
    let exist = false;
    for await (const param of search) {
      exist |= await checkUserExists(param);
    }
    return exist;
  }
  let exists = false;
  await Promise.all(
    Object.keys(search).map(async (key) => {
      const query = `
      SELECT COUNT(*) 
      FROM USER
      WHERE ${key}="${search[key]}"
    `;
      const [result] = await db.executeQuery(query);
      exists |= result["COUNT(*)"] ? true : false;
    })
  );
  return exists;
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
  const exists = await checkUserExists(data);
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
  updateUserById,
  deleteUserById,
};
