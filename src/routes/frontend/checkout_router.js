const express = require('express');
const router = express.Router();

const { checkoutController: controller } = require('@controllers');
const { validator } = require('@helpers');

router.get('/', controller.renderCheckout);

router.post('/', validator.couponCheck, controller.checkCoupon);

router.post('/location', controller.getShippingFee);

router.post('/createOrder', validator.orderFormValidate, controller.create);

module.exports = router;
