const express = require('express');
const router = express.Router();

const { shopController: controller } = require('@controllers');

router.get('/san-pham/:slugId', controller.renderProductDetail);

router.get('(/:mainSlug/:slugId)?', controller.renderShop);

module.exports = router;
