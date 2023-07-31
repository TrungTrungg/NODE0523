const { body } = require('express-validator');

const { userValidator: validator, notify } = require('@utils');
const { userService } = require('@services');
const bcrypt = require('bcrypt');

const fnameCheck = body('fname').notEmpty().withMessage(notify.ERROR_USER_FNAME_EMPTY);

const lnameCheck = body('lname').notEmpty().withMessage(notify.ERROR_USER_LNAME_EMPTY);

const addressCheck = body('address').notEmpty().withMessage(notify.ERROR_USER_ADDRESS_EMPTY);

const emailCheck = body('email')
    .notEmpty()
    .withMessage(notify.ERROR_USER_EMAIL_EMPTY)
    .bail()
    .isEmail()
    .withMessage(notify.ERROR_USER_EMAIL_VALUE)
    .bail()
    .custom(async (value, { req }) => {
        const user = await userService.getOne(req.body.email);
        if (user) {
            throw new Error(notify.ERROR_USER_EMAIL_DUPLICATE);
        }
        return true;
    });

const phoneCheck = body('phone')
    .notEmpty()
    .withMessage(notify.ERROR_USER_PHONE_EMPTY)
    .bail()
    .isNumeric()
    .withMessage(notify.ERROR_USER_PHONE_VALUE)
    .bail()
    .isLength({ min: validator.phone.length.min, max: validator.phone.length.max })
    .withMessage(notify.ERROR_USER_PHONE_LENGTH);

const passwordCheck = body('password')
    .notEmpty()
    .withMessage(notify.ERROR_USER_PASSWORD_EMPTY)
    .bail()
    .isLength({ min: validator.password.length.min, max: validator.password.length.max })
    .withMessage(notify.ERROR_USER_PASSWORD_LENGTH);

const comfirmPasswordCheck = body('passwordComfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error(notify.ERROR_USER_CONFIRMPASSWORD);
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
const passwordLoginCheck = body('passwordLogin')
    .notEmpty()
    .bail()
    .custom(async (value, { req }) => {
        let user = await userService.getOne(req.body.email);
        if (req.app.locals.user) {
            user = req.app.locals.user;
        }
        const match = await bcrypt.compare(value, user.password);
        if (!match) {
            throw new Error(notify.ERROR_USER_PASSWORD_VALUE);
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
