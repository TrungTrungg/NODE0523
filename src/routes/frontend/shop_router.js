const express = require('express');
const router = express.Router();

const { shopController: controller } = require('@controllers');

router.get('(/category/:slugId)?', controller.renderShop);

router.get('/product/:slugId', controller.renderProductDetail);

module.exports = router;
