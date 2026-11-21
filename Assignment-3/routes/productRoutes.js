const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStock,
  getSummary
} = require('../controllers/productController');
const validateId = require('../middleware/validateId');
const { validateProductBody, validateStockChange } = require('../middleware/validateProduct');

const router = express.Router();

router.get('/low-stock', getLowStock);
router.get('/summary', getSummary);

router.route('/')
  .get(getProducts)
  .post(validateProductBody(true), createProduct);

router.patch('/:id/stock', validateId, validateStockChange, updateStock);

router.route('/:id')
  .all(validateId)
  .get(getProductById)
  .put(validateProductBody(false), updateProduct)
  .delete(deleteProduct);

module.exports = router;
