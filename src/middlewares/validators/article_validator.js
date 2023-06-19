const { body } = require('express-validator');

const { articleValidator: validator, notify } = require('@utils');

const nameArticle = body('name')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: validator.name.length.max })
    .withMessage(notify.ERROR_NAME_LENGTH);

const orderingArticle = body('ordering')
    .notEmpty()
    .withMessage(notify.ERROR_ORDERING_EMPTY)
    .bail()
    .isNumeric()
    .withMessage(notify.ERROR_ORDERING_VALUE)
    .bail()
    .isInt({ min: validator.ordering.length.min, max: validator.ordering.length.max })
    .withMessage(notify.ERROR_ORDERING_LENGTH);
const statusArticle = body('status').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);
const categoryArticle = body('category_id').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);
const descriptionArticle = body('description').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);
const authornArticle = body('author').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

module.exports = {
    nameArticle,
    orderingArticle,
    statusArticle,
    categoryArticle,
    descriptionArticle,
    authornArticle,
};
