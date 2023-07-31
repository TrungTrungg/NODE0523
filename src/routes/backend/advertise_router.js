const express = require('express');
const router = express.Router();
const multer = require('multer');

const { advertiseController: controller } = require('@controllers');
const upload = multer({ dest: './public/uploads/advertise' });

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Chuyển hướng trang tạo mới Item
router.get('/add', controller.renderAddPage);

// Thêm 1 Item
router.post('/', upload.single('image'), controller.addOne);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', controller.renderEditPage);

// Sửa 1 Item
router.post('/edit', upload.single('image'), controller.editOne);

module.exports = router;
