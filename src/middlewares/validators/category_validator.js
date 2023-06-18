const { body } = require('express-validator');

const { categoryValidator: validator, notify } = require('@utils');

const nameCategory = body('name')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: validator.name.length.max })
    .withMessage(notify.ERROR_NAME_LENGTH);

const orderingCategory = body('ordering')
    .notEmpty()
    .withMessage(notify.ERROR_ORDERING_EMPTY)
    .bail()
    .isNumeric()
    .withMessage(notify.ERROR_ORDERING_VALUE)
    .bail()
    .isInt({ min: validator.ordering.length.min, max: validator.ordering.length.max })
    .withMessage(notify.ERROR_ORDERING_LENGTH);
const statusCategory = body('status').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

module.exports = {
    nameCategory,
    orderingCategory,
    statusCategory,
};
