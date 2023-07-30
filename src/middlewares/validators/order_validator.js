const { body } = require('express-validator');

const { orderValidator: validator, notify } = require('@utils');
const { couponService } = require('@services');
const emailCheck = body('email').notEmpty().withMessage(notify.ERROR_USER_EMAIL_EMPTY);
const locationCheck = body('location').notEmpty().withMessage(notify.ERROR_LOCATION_EMPTY);

const couponCheck = body('code')
    .notEmpty()
    .withMessage(notify.ERROR_COUPON_EMPTY)
    .bail()
    .custom(async (value, { req }) => {
        const today = new Date();
        const coupon = await couponService.getOneByCode(req.body.code);
        if (!coupon) {
            throw new Error(notify.ERROR_COUPON_VALUE);
        } else {
            if (coupon.expired_at) if (today > coupon.expired_at) throw new Error(notify.ERROR_COUPON_EXPIRED);
            if (coupon.quantity - coupon.used <= 0) throw new Error(notify.ERROR_COUPON_QTY);
            if (parseInt(coupon.condition) > parseInt(req.body.total)) throw new Error(notify.ERROR_COUPON_CONDITION);
        }
        return true;
    });
module.exports = {
    couponCheck,
    locationCheck,
    emailCheck,
};
