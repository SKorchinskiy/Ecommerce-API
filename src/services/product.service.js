const { mysql: db } = require("../configs/db.config");
const { redis: storage } = require("../configs/storage.config");

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

async function updateProductCartAmount(userId, productId, params) {
  const cart = await storage.get(`${userId}`);
  const updatedCart = cart ? JSON.parse(cart) : {};
  let amount = updatedCart[productId]
    ? updatedCart[productId] + params.amount
    : params.amount;
  amount = amount >= 0 ? amount : 0;
  updatedCart[productId] = amount;
  await storage.set(`${userId}`, JSON.stringify(updatedCart));
  return await getProductCart(userId);
}

async function getProductCart(userId) {
  const cartData = JSON.parse(await storage.get(`${userId}`));
  const products = Object.keys(cartData.products).map((productId) =>
    getProductById(productId)
  );
  let cart = {
    totalPrice: 0,
    products: [],
    updatedAt: new Date().toISOString(),
  };
  let totalPrice = 0;
  for await (let product of products) {
    const { id, productName, price } = product;
    if (cartData[id]) {
      const item = {
        productId: id,
        productName,
        quantity: +cartData[id],
        price: cartData[id] * price,
      };
      totalPrice += item.price;
      cart.products.push(item);
    }
  }
  cart.totalPrice = totalPrice;
  return cart;
}

async function clearProductCart(userId) {
  const data = {
    totalPrice: 0,
    products: [],
    updatedAt: Date.now(),
  };
  return await storage.set(`${userId}`, JSON.stringify(data));
}

async function deleteProductById(id) {
  const product = await getProductById(id);
  await db("product").where("id", id).del();
  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductCart,
  clearProductCart,
  createProduct,
  updateProductById,
  updateProductCartAmount,
  deleteProductById,
};
