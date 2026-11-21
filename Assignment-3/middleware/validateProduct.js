const AppError = require('../utils/AppError');

const stringFields = ['name', 'sku', 'category', 'supplier'];
const numberFields = ['price', 'quantity', 'reorderLevel'];
const requiredOnCreate = ['name', 'sku', 'category', 'price'];

const validateProductBody = (isCreate) => (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
    return next(new AppError('Request body is required', 400));
  }

  const errors = [];

  if (isCreate) {
    requiredOnCreate.forEach((field) => {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field} is required`);
      }
    });
  }

  stringFields.forEach((field) => {
    if (body[field] !== undefined && typeof body[field] !== 'string') {
      errors.push(`${field} must be a string`);
    }
  });

  numberFields.forEach((field) => {
    if (body[field] !== undefined && (typeof body[field] !== 'number' || !Number.isFinite(body[field]))) {
      errors.push(`${field} must be a number`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (typeof body.sku === 'string') {
    body.sku = body.sku.trim().toUpperCase();
  }

  next();
};

const validateStockChange = (req, res, next) => {
  const change = req.body && req.body.change;

  if (typeof change !== 'number' || !Number.isInteger(change) || change === 0) {
    return next(new AppError('change must be a non-zero whole number', 400));
  }

  next();
};

module.exports = { validateProductBody, validateStockChange };
