const { mysql: db } = require("../configs/db.config");
const productService = require("../services/product.service");

async function getAllOrders(params) {
  const ordersData = await getOrdersData(params);
  const orderIds = ordersData.map((orderData) => orderData.orderId);

  const productsData = await getOrderedProductsData(orderIds);

  const orders = formatOrderData(ordersData, productsData);
  return orders;
}

function formatOrderData(ordersData, productsData) {
  return ordersData.map((orderData) => {
    const { orderId, customerId, username, email, totalPrice, updatedAt } =
      orderData;

    const products = productsData.reduce((prods, productData) => {
      if (productData.orderId === orderId) {
        const { productId, productName, quantity, price } = productData;
        prods.push({
          productId,
          productName,
          quantity,
          price,
        });
      }
      return prods;
    }, []);

    const order = {
      orderId,
      customer: {
        customerId,
        username,
        email,
      },
      products,
      totalPrice,
      updatedAt,
    };
    return order;
  });
}

async function getOrderedProductsData(orderIds) {
  const specifiedOrders = function (queryBuilder) {
    if (orderIds) {
      queryBuilder.whereIn("OP.orderId", orderIds);
    }
  };

  const productsData = await db
    .select(
      "OP.orderId",
      "P.id as productId",
      "P.productName",
      "OP.quantity",
      "OP.price"
    )
    .from(db.raw("PRODUCT as P"))
    .join(db.raw("ORDER_PRODUCT as OP"), "P.id", "OP.productId")
    .modify(specifiedOrders);
  return productsData;
}

async function getOrdersData({ pagination, sort, range }, userId) {
  const specifiedUser = function (queryBuilder) {
    if (userId) {
      queryBuilder.where("U.id", userId);
    }
  };

  const ordersData = await db
    .select(
      "OD.id as orderId",
      "U.id as customerId",
      "U.username",
      "U.email",
      "OD.totalPrice",
      "OD.updatedAt"
    )
    .from(db.raw("ORDER_DETAILS as OD"))
    .join(db.raw("USER as U"), "OD.customerId", "U.id")
    .modify(specifiedUser)
    .modify(range, "OD", "totalPrice")
    .modify(sort)
    .modify(pagination);

  return ordersData;
}

async function getUserOrders(userId, snippets) {
  const ordersData = await getOrdersData(snippets, userId);
  const orderIds = ordersData.map((orderData) => orderData.orderId);
  const productsData = await getOrderedProductsData(orderIds);
  const orders = formatOrderData(ordersData, productsData);
  return orders;
}

async function getOrderById(id, context = db) {
  const [{ orderId, customerId, username, email, totalPrice, updatedAt }] =
    await context
      .select(
        "OD.id as orderId",
        "U.id as customerId",
        "U.username",
        "U.email",
        "OD.totalPrice",
        "OD.updatedAt"
      )
      .from(context.raw("ORDER_DETAILS as OD"))
      .join(context.raw("USER as U"), "OD.customerId", "U.id")
      .where("OD.id", id);

  const products = await context
    .select("P.id as productId", "P.productName", "OP.quantity", "OP.price")
    .from(context.raw("PRODUCT as P"))
    .join(context.raw("ORDER_PRODUCT as OP"), "P.id", "OP.productId")
    .where("OP.orderId", id);
  const order = {
    orderId,
    customer: {
      customerId,
      username,
      email,
    },
    products,
    totalPrice,
    updatedAt,
  };
  return order;
}

async function createOrder(userId, cart, context = db) {
  const { totalPrice, products } = cart;
  if (!products.length) {
    const error = new Error("Add product to the cart to make an order!");
    error.status = 400;
    throw error;
  }
  const [insertId] = await context("ORDER_DETAILS").insert({
    customerId: userId,
    totalPrice,
  });
  await updateOrderProducts(insertId, products, context);
  return await getOrderById(insertId, context);
}

async function updateOrderProducts(orderId, products, context = db) {
  for await (const product of products) {
    const { productId, quantity: orderQuantity, price } = product;
    await context("ORDER_PRODUCT").insert({
      orderId,
      productId,
      quantity: orderQuantity,
      price,
    });
    const { quantity } = await productService.getProductById(productId);
    if (quantity < orderQuantity) {
      const error = new Error("The amount of items excides the stock amount!");
      error.status = 400;
      throw error;
    }
    await productService.updateProductById(
      productId,
      {
        quantity: quantity - orderQuantity,
      },
      context
    );
  }
  return 1;
}

module.exports = {
  getAllOrders,
  getOrderById,
  getUserOrders,
  createOrder,
};
