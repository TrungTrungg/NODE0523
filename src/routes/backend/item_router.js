const express = require('express');
const router = express.Router();

const { formCheck } = require('@validators/item_validator');
const itemController = require('@controllers/item_controller');
// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', itemController.renderListItems);

// Chuyển hướng trang tạo mới Item
router.get('/add', itemController.renderAddPage);

// Thêm 1 Item
router.post('/', formCheck, itemController.addOne);

// Xóa 1 Item
router.get('/delete/:id', itemController.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', itemController.renderEditPage);

// Sửa 1 Item
router.post('/edit', formCheck, itemController.editOne);

// Sửa status của 1 Item
router.get('(/:id/:status)?', itemController.changeStatus);

module.exports = router;
