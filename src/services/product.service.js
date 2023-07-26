const { mysql: db } = require("../configs/db.config");

async function getAllProducts({ offset, limit }) {
  return await db("product")
    .select("id", "productName", "price", "quantity")
    .offset(offset)
    .limit(limit);
}

async function getProductById(id) {
  const [product] = await db("product")
    .where("id", id)
    .select("id", "productName", "price", "quantity", "ownerId");

  if (!product) {
    const error = new Error(`Requested product was not found!`);
    error.status = 404;
    throw error;
  }

  return product;
}

async function createProduct(data) {
  const { productName, price, quantity, ownerId } = data;
  const [insertId] = await db("product").insert({
    productName,
    price,
    quantity,
    ownerId,
  });
  return await getProductById(insertId);
}

async function updateProductById(id, data) {
  const exists = await checkProductExists(id);
  if (!exists) {
    const error = new Error("product was not found!");
    error.status = 404;
    throw error;
  }
  await db("product").where("id", id).update(data);
  return await getProductById(id);
}

async function checkProductExists(id) {
  const [product] = await db("product")
    .where("id", id)
    .select("id", "productName", "price", "quantity");
  return product ? true : false;
}

async function deleteProductById(id) {
  const product = await getProductById(id);
  await db("product").where("id", id).del();
  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
