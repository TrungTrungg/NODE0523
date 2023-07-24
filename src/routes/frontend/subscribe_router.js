const express = require('express');
const router = express.Router();

const { frontSubscribeController: controller } = require('@controllers');
const { validator } = require('@helpers');

// Đỗ dữ liệu trang Item
router.post('/', validator.subscribeFormValidate, controller.addEmailAndSend);

module.exports = router;
