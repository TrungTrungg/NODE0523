const express = require('express');
const router = express.Router();

const { orderController: controller } = require('@controllers');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

router.get('(/detail/:id)?', controller.renderDetail);

router.post('/changeStatusAjax', controller.changeStatusAjax);

module.exports = router;
