const express = require('express');
const router = express.Router();
const multer = require('multer');

const { validator } = require('@helpers');
const { sliderController: controller } = require('@controllers');
const upload = multer({ dest: './public/uploads/slider' });

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

// Sửa status của 1 Item
// router.get('(/:id/:status)?', controller.changeStatus);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

// Sửa ordering của 1 Item
router.get('/changeOrderingAjax/:id/:ordering', controller.changeOrderingAjax);

router.get('/changeUrlAjax/:id/:url', controller.changeUrlAjax);

router.get('/changeIsSpecialAjax/:id/:is_special', controller.changeIsSpecialAjax);

router.get('/getListCategoriesAjax/:category_id', controller.getListCategoriesAjax);

module.exports = router;
