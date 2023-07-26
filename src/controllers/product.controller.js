const productService = require("../services/product.service");

async function getAllProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts();
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
  createProduct,
  updateProductById,
  deleteProductById,
};
