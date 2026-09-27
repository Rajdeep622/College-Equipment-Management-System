const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 6 })
    .withMessage('First & Last name must be at least 6 characters total')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Name must contain alphabets only'),
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID / Roll Number is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email address is required (e.g. name@domain.com)'),
  body('phone')
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Mobile Number must contain exactly 10 numeric digits'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address cannot be empty'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters length'),
  validateRequest
];

const loginValidation = [
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID / Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateRequest
];

const equipmentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Equipment name is required'),
  body('category')
    .isIn(['Academic', 'Electronics', 'Lab Tools', 'Computer Hardware', 'Networking', 'Books', 'Other'])
    .withMessage('Invalid category specified'),
  body('totalQuantity')
    .isInt({ min: 1 })
    .withMessage('Total quantity must be a positive integer'),
  body('maxDays')
    .isInt({ min: 1 })
    .withMessage('Maximum issue duration must be at least 1 day'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Storage location is required'),
  validateRequest
];

const issueValidation = [
  body('equipmentId')
    .notEmpty()
    .withMessage('Equipment selection is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('issueDate')
    .isISO8601()
    .withMessage('Valid issue date is required'),
  body('expectedReturnDate')
    .isISO8601()
    .withMessage('Valid expected return date is required'),
  validateRequest
];

module.exports = {
  validateRequest,
  registerValidation,
  loginValidation,
  equipmentValidation,
  issueValidation
};
