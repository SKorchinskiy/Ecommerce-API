const { mysql: db } = require("../configs/db.config");
const { redis: storage } = require("../configs/storage.config");

async function getAllProducts(querySnippets) {
  const { pagination, sort, range } = querySnippets;
  return await db("product")
    .select("id", "productName", "price", "quantity")
    .modify(range, "product", "price")
    .modify(sort)
    .modify(pagination);
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

async function updateProductById(id, data, context = db) {
  const exists = await checkProductExists(id);
  if (!exists) {
    const error = new Error("product was not found!");
    error.status = 404;
    throw error;
  }
  await context("product").where("id", id).update(data);
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

  const updatedCart = cart ? JSON.parse(cart) : { totalPrice: 0, products: [] };
  updatedCart.updatedAt = new Date().toISOString();

  const product = await getProductById(productId);

  let amount = updatedCart.products.reduce((sum, product) => {
    if (product.productId === productId) {
      return sum + product.quantity;
    }
    return sum;
  }, params.amount);
  amount = amount >= 0 ? amount : 0;

  const exists = updatedCart.products.some((product) => {
    if (product.productId === productId) {
      product.quantity = amount;
      return true;
    }
    return false;
  });

  if (!exists && amount) {
    updatedCart.products.push({
      productId,
      productName: product.productName,
      quantity: amount,
      price: amount * product.price,
    });
  }

  updatedCart.totalPrice = updatedCart.products.reduce(
    (sum, product) => sum + product.price,
    0
  );

  if (amount > product.quantity) {
    const error = new Error(
      "The required amount of product excides the stock amount!"
    );
    error.status = 400;
    throw error;
  }

  await storage.set(`${userId}`, JSON.stringify(updatedCart));
  return await getProductCart(userId);
}

async function getProductCart(userId) {
  const data = await storage.get(`${userId}`);
  let cartData = JSON.parse(data);
  let cart = Object.assign(
    {
      totalPrice: 0,
      products: [],
      updatedAt: new Date().toISOString(),
    },
    cartData ?? {}
  );
  return cart;
}

async function clearProductCart(userId) {
  const data = {
    totalPrice: 0,
    products: [],
    updatedAt: new Date().toISOString(),
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
