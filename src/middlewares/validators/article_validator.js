const { body } = require('express-validator');

const { articleValidator: validator, notify } = require('@utils');

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

const categoryCheck = body('category_id').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const descriptionCheck = body('description').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const authorCheck = body('author').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const urlCheck = body('url').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const specialCheck = body('is_special').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const dateCheck = body('post_date')
    .notEmpty()
    .withMessage(notify.ERROR_STATUS_EMPTY)
    .bail()
    .isDate()
    .withMessage(notify.ERROR_ORDERING_VALUE);

module.exports = {
    nameCheck,
    orderingCheck,
    statusCheck,
    categoryCheck,
    descriptionCheck,
    authorCheck,
    dateCheck,
    urlCheck,
    specialCheck,
};
