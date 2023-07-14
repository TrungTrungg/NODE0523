const express = require('express');
const router = express.Router();

const { cartController: controller } = require('@controllers');

router.get('/', controller.renderCart);

module.exports = router;
