const express = require('express');
const router = express.Router();

const { shopController: controller } = require('@controllers');

router.get('(/category/:category_id)?', controller.renderShop);

router.get('/product/:id', controller.renderProductDetail);

module.exports = router;
