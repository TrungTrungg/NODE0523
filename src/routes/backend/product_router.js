const express = require('express');
const router = express.Router();
const multer = require('multer');

const { validator } = require('@helpers');
const { productController: controller } = require('@controllers');
const upload = multer({ dest: './public/uploads/product' });

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Chuyển hướng trang tạo mới Item
router.get('/add', controller.renderAddPage);

// Thêm 1 Item
router.post('/', upload.any(), validator.productFormValidate, controller.addOne);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', controller.renderEditPage);

// Sửa 1 Item
router.post('/edit', upload.any(), validator.productFormValidate, controller.editOne);

// Sửa status của 1 Item
// router.get('(/:id/:status)?', controller.changeStatus);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

// Sửa ordering của 1 Item
router.get('/changeOrderingAjax/:id/:ordering', controller.changeOrderingAjax);

router.get('/changeUrlAjax/:id/:url', controller.changeUrlAjax);

router.get('/changeIsSpecialAjax/:id/:is_special', controller.changeIsSpecialAjax);

router.get('/changeIsShowhomeAjax/:id/:is_showhome', controller.changeIsShowhomeAjax);

router.get('/getListCategoriesAjax/:category_id', controller.getListCategoriesAjax);

module.exports = router;
