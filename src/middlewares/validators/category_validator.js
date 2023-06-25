const { body } = require('express-validator');

const { categoryValidator: validator, notify } = require('@utils');

const nameCheck = body('name')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: validator.name.length.max })
    .withMessage(notify.ERROR_NAME_LENGTH);

const orderingCheck = body('ordering')
    .notEmpty()
    .withMessage(notify.ERROR_ORDERING_EMPTY)
    .bail()
    .isNumeric()
    .withMessage(notify.ERROR_ORDERING_VALUE)
    .bail()
    .isInt({ min: validator.ordering.length.min, max: validator.ordering.length.max })
    .withMessage(notify.ERROR_ORDERING_LENGTH);
const statusCheck = body('status').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const urlCheck = body('url').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const categoryCheck = body('category_id').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

module.exports = {
    nameCheck,
    orderingCheck,
    statusCheck,
    urlCheck,
    categoryCheck,
};
