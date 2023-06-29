const express = require('express');
const router = express.Router();

const { subcribeController: controller } = require('@controllers');
const { validator } = require('@helpers');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);
router.post('/', validator.subcribeFormValidate, controller.addEmailAndSend);
router.post('/sendAll', controller.sendAllMail);
router.get('/delete/:id', controller.deleteOne);
router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

module.exports = router;
