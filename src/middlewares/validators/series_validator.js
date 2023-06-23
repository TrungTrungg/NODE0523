const { body } = require('express-validator');

const { seriesValidator: validator, notify } = require('@utils');

const nameSeries = body('name')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: validator.name.length.max })
    .withMessage(notify.ERROR_NAME_LENGTH);

const orderingSeries = body('ordering')
    .notEmpty()
    .withMessage(notify.ERROR_ORDERING_EMPTY)
    .bail()
    .isNumeric()
    .withMessage(notify.ERROR_ORDERING_VALUE)
    .bail()
    .isInt({ min: validator.ordering.length.min, max: validator.ordering.length.max })
    .withMessage(notify.ERROR_ORDERING_LENGTH);

const statusSeries = body('status').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const categorySeries = body('category_id').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

const urlSeries = body('url').notEmpty().withMessage(notify.ERROR_STATUS_EMPTY);

module.exports = {
    nameSeries,
    orderingSeries,
    statusSeries,
    categorySeries,
    urlSeries,
};
