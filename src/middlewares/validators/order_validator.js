const { body } = require('express-validator');

const { orderValidator: validator, notify } = require('@utils');
const { couponService } = require('@services');

const fnameCheck = body('fname')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: 10 })
    .withMessage(notify.ERROR_NAME_LENGTH);

const lnameCheck = body('lname')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isLength({ max: 10 })
    .withMessage(notify.ERROR_NAME_LENGTH);

const addressCheck = body('address').notEmpty().withMessage(notify.ERROR_USER_ADDRESS);

const emailCheck = body('email')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .isEmail()
    .withMessage(notify.ERROR_USER_LOGIN);

const phoneCheck = body('phone')
    .notEmpty()
    .withMessage(notify.ERROR_ORDERING_EMPTY)
    .bail()
    .isNumeric()
    .withMessage(notify.ERROR_ORDERING_VALUE)
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage(notify.ERROR_ORDERING_LENGTH);
const locationCheck = body('location').notEmpty().withMessage(notify.ERROR_ORDERING_EMPTY);

const couponCheck = body('code')
    .notEmpty()
    .withMessage(notify.ERROR_NAME_EMPTY)
    .bail()
    .custom(async (value, { req }) => {
        const today = new Date();
        const coupon = await couponService.getOneByCode(req.body.code);
        if (!coupon) {
            throw new Error('Không họp lệ!');
        } else {
            if (today > coupon.expired_at) throw new Error('Hết hạn!');
            if (coupon.quantity <= 0) throw new Error('Không còn mã giảm này!');
            if (parseInt(coupon.condition) > parseInt(req.body.total)) throw new Error('Không đủ điều kiện!');
        }
        return true;
    });
module.exports = {
    couponCheck,
    fnameCheck,
    lnameCheck,
    addressCheck,
    emailCheck,
    phoneCheck,
    locationCheck,
};
