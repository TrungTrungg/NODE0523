const express = require('express');
const router = express.Router();
const multer = require('multer');

const { formCheck } = require('@validators');
const { itemController } = require('@controllers');
const upload = multer({ dest: './public/backend/uploads' });
// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', itemController.renderListItems);

// Chuyển hướng trang tạo mới Item
router.get('/add', itemController.renderAddPage);

// Thêm 1 Item
router.post('/', upload.single('image'), formCheck, itemController.addOne);

// Xóa 1 Item
router.get('/delete/:id', itemController.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', itemController.renderEditPage);

// Sửa 1 Item
router.post('/edit', upload.single('image'), formCheck, itemController.editOne);

// Sửa status của 1 Item
// router.get('(/:id/:status)?', itemController.changeStatus);

router.get('/changeStatusAjax/:id/:status', itemController.changeStatusAjax);

// Sửa ordering của 1 Item
router.get('/changeOrderingAjax/:id/:ordering', itemController.changeOrderingAjax);

module.exports = router;
