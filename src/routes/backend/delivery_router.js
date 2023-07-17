const express = require('express');
const router = express.Router();

const { deliveryController: controller } = require('@controllers');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);
router.get('/add', controller.renderAddPage);

router.post('/', controller.addOne);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', controller.renderEditPage);

// Sửa 1 Item
router.post('/edit', controller.editOne);

// Sửa status của 1 Item
router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

module.exports = router;
