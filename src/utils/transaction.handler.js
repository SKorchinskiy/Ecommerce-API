const { mysql: db } = require("../configs/db.config");

async function transaction(cb) {
  const trx = await db.transaction();
  try {
    const result = await cb(trx);
    await trx.commit();
    return result;
  } catch (e) {
    await trx.rollback();
    const error = new Error("Failed to complete action!");
    error.status = 500;
    throw error;
  }
}

module.exports = { transaction };
