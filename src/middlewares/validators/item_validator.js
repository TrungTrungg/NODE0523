const util = require('node:util');

const { body, validationResult } = require('express-validator');
const { itemValidator } = require('@utils/item_util');
const notifyUtil = require('@utils/notify_util');

const formCheck = [
    body('name')
        .notEmpty()
        .withMessage(notifyUtil.ERROR_NAME_EMPTY)
        .bail()
        .isLength({ max: itemValidator.name.length.max })
        .withMessage(notifyUtil.ERROR_NAME_LENGTH),
    body('ordering')
        .notEmpty()
        .withMessage(notifyUtil.ERROR_ORDERING_EMPTY)
        .bail()
        .isNumeric()
        .withMessage(notifyUtil.ERROR_ORDERING_VALUE)
        .bail()
        .isInt({ min: itemValidator.ordering.length.min, max: itemValidator.ordering.length.max })
        .withMessage(notifyUtil.ERROR_ORDERING_LENGTH),
    body('status').notEmpty().withMessage(notifyUtil.ERROR_STATUS_EMPTY),
];

const resultsValidator = (req) => {
    let messages = [];
    if (!validationResult(req).isEmpty()) {
        const { errors } = validationResult(req);
        messages = errors;
    }
    return messages;
};

module.exports = {
    formCheck,
    resultsValidator,
};
