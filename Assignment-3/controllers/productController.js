const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const editableFields = ['name', 'sku', 'category', 'price', 'quantity', 'reorderLevel', 'supplier'];
const sortableFields = ['name', 'sku', 'category', 'price', 'quantity', 'reorderLevel', 'createdAt', 'updatedAt'];

const pickFields = (body) => {
  const data = {};
  editableFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const asText = (value) => (typeof value === 'string' ? value.trim() : '');

const buildSort = (sortParam) => {
  const sort = {};

  if (typeof sortParam === 'string') {
    sortParam.split(',').forEach((item) => {
      const desc = item.startsWith('-');
      const key = desc ? item.slice(1) : item;
      if (sortableFields.includes(key)) {
        sort[key] = desc ? -1 : 1;
      }
    });
  }

  if (Object.keys(sort).length === 0) {
    sort.createdAt = -1;
  }

  sort._id = 1;
  return sort;
};

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pickFields(req.body));
  res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
  const { category, supplier, search, minPrice, maxPrice, inStock } = req.query;
  const filter = {};

  if (asText(category)) {
    filter.category = new RegExp(`^${escapeRegex(asText(category))}$`, 'i');
  }

  if (asText(supplier)) {
    filter.supplier = new RegExp(escapeRegex(asText(supplier)), 'i');
  }

  if (asText(search)) {
    filter.name = new RegExp(escapeRegex(asText(search)), 'i');
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      const min = Number(minPrice);
      if (Number.isNaN(min)) throw new AppError('minPrice must be a number', 400);
      filter.price.$gte = min;
    }

    if (maxPrice !== undefined) {
      const max = Number(maxPrice);
      if (Number.isNaN(max)) throw new AppError('maxPrice must be a number', 400);
      filter.price.$lte = max;
    }
  }

  if (inStock === 'true') filter.quantity = { $gt: 0 };
  if (inStock === 'false') filter.quantity = 0;

  const page = req.query.page === undefined ? 1 : parseInt(req.query.page, 10);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit, 10);

  if (Number.isNaN(page) || page < 1) throw new AppError('page must be a positive number', 400);
  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    throw new AppError('limit must be between 1 and 100', 400);
  }

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort(buildSort(req.query.sort))
      .skip((page - 1) * limit)
      .limit(limit)
  ]);

  res.json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    count: products.length,
    products
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new AppError('Product not found', 404);

  res.json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: pickFields(req.body) },
    { new: true, runValidators: true }
  );

  if (!product) throw new AppError('Product not found', 404);

  res.json(product);
});

const updateStock = asyncHandler(async (req, res) => {
  const { change } = req.body;

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, quantity: { $gte: -change } },
    { $inc: { quantity: change } },
    { new: true, runValidators: true }
  );

  if (!product) {
    const exists = await Product.exists({ _id: req.params.id });
    if (!exists) throw new AppError('Product not found', 404);
    throw new AppError('Insufficient stock for this sale', 400);
  }

  res.json({ message: 'Stock updated', product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) throw new AppError('Product not found', 404);

  res.json({ message: 'Product deleted', id: product.id });
});

const getLowStock = asyncHandler(async (req, res) => {
  const lowStockItems = await Product.find({
    $expr: { $lte: ['$quantity', '$reorderLevel'] }
  }).sort({ quantity: 1, name: 1 });

  res.json({ count: lowStockItems.length, lowStockItems });
});

const getSummary = asyncHandler(async (req, res) => {
  const summary = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
        avgPrice: { $avg: '$price' }
      }
    },
    {
      $project: {
        totalItems: 1,
        totalQuantity: 1,
        totalStockValue: 1,
        avgPrice: { $round: ['$avgPrice', 2] }
      }
    },
    { $sort: { totalStockValue: -1 } }
  ]);

  res.json({ categories: summary.length, summary });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStock,
  getSummary
};
