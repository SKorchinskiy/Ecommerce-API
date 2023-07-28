const productService = require("../services/product.service");
const queryUtils = require("../utils/query.handler");

async function getAllProducts(req, res, next) {
  try {
    const snippets = queryUtils.getQuerySnippets(req.query);
    const products = await productService.getAllProducts(snippets);
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductCart(req, res, next) {
  try {
    const { id: userId } = req.user;
    const cart = await productService.getProductCart(userId);
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const data = Object.assign({}, req.body, { ownerId: req.user.id });
    const product = await productService.createProduct(data);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProductById(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await productService.updateProductById(id, data);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function addProductToCart(req, res, next) {
  try {
    const amount = +req.query.amount || 1;
    const cart = await updateProductCartAmount(+req.user.id, +req.params.id, {
      amount,
    });
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
}

async function dropProductFromCart(req, res, next) {
  try {
    const amount = -req.query.amount || -1;
    const cart = await updateProductCartAmount(+req.user.id, +req.params.id, {
      amount,
    });
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProductCartAmount(userId, productId, params) {
  const cart = await productService.updateProductCartAmount(
    userId,
    productId,
    params
  );
  return cart;
}

async function deleteProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.deleteProductById(id);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductCart,
  createProduct,
  updateProductById,
  addProductToCart,
  dropProductFromCart,
  deleteProductById,
};
