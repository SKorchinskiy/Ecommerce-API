const db = require("../configs/db.config");

async function getProductById(id) {
  const query = `
      SELECT id, productName, price, quantity, createdAt
      FROM PRODUCT
      WHERE id=${id}
    `;
  const product = await db.executeQuery(query);
  if (!product) {
    const error = new Error(`Requested product was not found!`);
    error.status = 404;
    throw error;
  }
  return product;
}

async function createProduct(data) {
  const { productName, price, quantity } = data;
  const query = `
      INSERT INTO PRODUCT (productName, price, quantity)
      VALUES ("${productName}", "${price}", "${quantity}")
  `;
  const product = await db.executeQuery(query);
  return product;
}

async function updateProductById(id, data) {
  const values = Object.keys(data).map((key, index) => {
    return (index ? "," : "") + `${key}="${data[key]}"`;
  });
  const query = `
        ALTER TABLE PRODUCT
        SET ${values}
  `;
  await db.executeQuery(query);
  const product = await getProductById(id);
  return product;
}

async function deleteProductById(id) {
  const product = await getProductById(id);
  const query = `
      DELETE FROM PRODUCT
      WHERE id=${id}
  `;
  await db.executeQuery(query);
  return product;
}

module.exports = {
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
