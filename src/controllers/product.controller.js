const productService = require("../services/product.service");

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function createProduct(req, res) {
  try {
    const data = req.body;
    const product = await productService.createProduct(data);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function updateProductById(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await productService.updateProductById(id, data);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

async function deleteProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.deleteProductById(id);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    const { status, message } = error;
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
