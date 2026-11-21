const AppError = require('../utils/AppError');

const validateId = (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return next(new AppError('Invalid product id', 400));
  }
  next();
};

module.exports = validateId;
