const express = require('express');
const router = express.Router();
const multer = require('multer');

const { validator } = require('@helpers');
const { userController: controller } = require('@controllers');
const upload = multer({ dest: './public/uploads/user' });

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', controller.renderEditPage);

// Sửa 1 Item
router.post('/edit', upload.single('image'), controller.editOne);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

module.exports = router;
