const express = require('express');
const router = express.Router();
const multer = require('multer');

const { nameItem: nameCheck, orderingItem: orderingCheck, statusItem: statusCheck } = require('@validators');
const { itemController: controller } = require('@controllers');
const upload = multer({ dest: './public/backend/uploads' });

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Chuyển hướng trang tạo mới Item
router.get('/add', controller.renderAddPage);

// Thêm 1 Item
router.post('/', upload.single('image'), [nameCheck, orderingCheck, statusCheck], controller.addOne);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', controller.renderEditPage);

// Sửa 1 Item
router.post('/edit', upload.single('image'), [nameCheck, orderingCheck, statusCheck], controller.editOne);

// Sửa status của 1 Item
// router.get('(/:id/:status)?', controller.changeStatus);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

// Sửa ordering của 1 Item
router.get('/changeOrderingAjax/:id/:ordering', controller.changeOrderingAjax);

router.get('/RSSnew', controller.getDataRss);

module.exports = router;
