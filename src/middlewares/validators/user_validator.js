const { body } = require('express-validator');

const { userValidator: validator, notify } = require('@utils');
const { userService } = require('@services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fnameCheck = body('fname')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: validator.name.length.max })
    .withMessage(notify.ERROR_NAME_LENGTH);

const lnameCheck = body('lname')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: validator.name.length.max })
    .withMessage(notify.ERROR_NAME_LENGTH);

const addressCheck = body('address').notEmpty().withMessage(notify.ERROR_USER_ADDRESS);

const emailCheck = body('email')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isEmail()
    .withMessage(notify.ERROR_USER_LOGIN)
    .bail()
    .custom(async (value, { req }) => {
        const user = await userService.getOne(req.body.email);
        if (user) {
            throw new Error('Trùng');
        }
        return true;
    });

const phoneCheck = body('phone')
    .notEmpty()
    .withMessage(notify.ERROR_ORDERING_EMPTY)
    .bail()
    .isNumeric()
    .withMessage(notify.ERROR_ORDERING_VALUE)
    .bail()
    .isLength({ min: validator.phone.length.min, max: validator.phone.length.max })
    .withMessage(notify.ERROR_ORDERING_LENGTH);

const passwordCheck = body('password')
    .notEmpty()
    .withMessage(notify.ERROR_ORDERING_EMPTY)
    .bail()
    .isLength({ min: validator.password.length.min, max: validator.password.length.max })
    .withMessage(notify.ERROR_NAME_LENGTH);

const comfirmPasswordCheck = body('passwordComfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error(notify.ERROR_ORDERING_VALUE);
    }
    return true;
});

const emailLoginCheck = body('email')
    .notEmpty()
    .bail()
    .isEmail()
    .bail()
    .custom(async (value, { req }) => {
        const user = await userService.getOne(req.body.email);
        if (!user) {
            throw new Error();
        }
        return true;
    });
const passwordLoginCheck = body('password')
    .notEmpty()
    .bail()
    .custom(async (value, { req }) => {
        const user = await userService.getOne(req.body.email);
        const match = await bcrypt.compare(value, user.password);
        if (!match) {
            throw new Error();
        }
        return true;
    });
module.exports = {
    lnameCheck,
    fnameCheck,
    addressCheck,
    emailCheck,
    phoneCheck,
    passwordCheck,
    comfirmPasswordCheck,
    emailLoginCheck,
    passwordLoginCheck,
};
