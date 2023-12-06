const { validationResult, check } = require('express-validator');
const Account = require('../models/account');

const checkRegister = [
    check('email')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            const existingAccount = await Account.findOne({ email: value });
            if (existingAccount) {
                throw new Error('Email already exists.');
            }
        }),

    check('name')
        .not().isEmpty().withMessage('Fullname cannot be empty.')
        .matches(/^[\p{L}\s]*$/u).withMessage('Fullname should only contain letters and spaces.'),

    check('gender')
        .not().isEmpty().withMessage('Gender cannot be empty.')
        .isIn(['male', 'female']).withMessage('Invalid gender value.'),

    check('birthday')
        .not().isEmpty().withMessage('Birthday cannot be empty.')
        .custom((value) => {
            if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                throw new Error('Invalid date format. Please use yyyy-mm-dd.');
            }
            return true;
        }),

    check('phone')
        .not().isEmpty().withMessage('Phone cannot be empty.')
        .isNumeric().withMessage('Phone must contain only numbers.')
        .isLength({ min: 10, max: 11 }).withMessage('Phone must be 10 or 11 digits long.')
        .custom(async (value) => {
            const existingAccount = await Account.findOne({ 'profile.phone': value });
            if (existingAccount) {
                throw new Error('Phone number already exists.');
            }
        }),

    check('num')
        .not().isEmpty().withMessage('Address number cannot be empty.'),

    check('street')
        .not().isEmpty().withMessage('Street cannot be empty.'),

    check('ward')
        .not().isEmpty().withMessage('Ward cannot be empty.'),

    check('district')
        .not().isEmpty().withMessage('District cannot be empty.'),

    check('city')
        .not().isEmpty().withMessage('City cannot be empty.'),
];

const checkUpdate = [
    check('Id').notEmpty().withMessage('Id cannot be empty.'),

    check('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .custom(async (value, { req }) => {
            if (value) {
                const existingAccount = await Account.findOne({ email: value, Id: { $ne: req.body.Id } });
                if (existingAccount) {
                    throw new Error('Email already exists.');
                }
            }
        }),

    check('name')
        .optional()
        .not().isEmpty().withMessage('Fullname cannot be empty.')
        .matches(/^[\p{L}\s]*$/u).withMessage('Fullname should only contain letters and spaces.'),

    check('gender')
        .optional()
        .not().isEmpty().withMessage('Gender cannot be empty.')
        .isIn(['male', 'female']).withMessage('Invalid gender value.'),

    check('birthday')
        .optional()
        .not().isEmpty().withMessage('Birthday cannot be empty.')
        .custom((value) => {
            if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                throw new Error('Invalid date format. Please use yyyy-mm-dd.');
            }
            return true;
        }),

    check('phone')
        .optional()
        .not().isEmpty().withMessage('Phone cannot be empty.')
        .isNumeric().withMessage('Phone must contain only numbers.')
        .isLength({ min: 10, max: 11 }).withMessage('Phone must be 10 or 11 digits long.')
        .custom(async (value, { req }) => {
            if (value) {
                const existingAccount = await Account.findOne({ 'profile.phone': value, Id: { $ne: req.body.Id } });
                if (existingAccount) {
                    throw new Error('Phone number already exists.');
                }
            }
        }),

    check('num')
        .optional()
        .not().isEmpty().withMessage('Address number cannot be empty.'),

    check('street')
        .optional()
        .not().isEmpty().withMessage('Street cannot be empty.'),

    check('ward')
        .optional()
        .not().isEmpty().withMessage('Ward cannot be empty.'),

    check('district')
        .optional()
        .not().isEmpty().withMessage('District cannot be empty.'),

    check('city')
        .optional()
        .not().isEmpty().withMessage('City cannot be empty.'),

    check('role')
        .optional()
        .isIn(['admin', 'staff']).withMessage('Invalid role value.'),

    check('locked')
        .optional()
        .isBoolean().withMessage('Invalid locked value.'),
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({ field: error.path, msg: error.msg }));
        return res.status(400).json({ success: false, errors: errorMessages });
    }
    next();
}

module.exports = { validate, checkRegister, checkUpdate };