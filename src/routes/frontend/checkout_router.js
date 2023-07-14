const express = require('express');
const router = express.Router();

const { checkoutController: controller } = require('@controllers');

router.get('/', controller.renderCheckout);

module.exports = router;
