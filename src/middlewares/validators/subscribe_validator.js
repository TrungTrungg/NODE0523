const { body } = require('express-validator');

const { itemValidator: validator, notify } = require('@utils');

const mailCheck = body('email')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isEmail()
    .withMessage(notify.ERROR_USER_EMAIL_VALUE);

module.exports = {
    mailCheck,
};
