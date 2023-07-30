const express = require('express');
const router = express.Router();

const { contactController: controller } = require('@controllers');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

module.exports = router;
