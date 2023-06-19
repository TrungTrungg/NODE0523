const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    nameArticle: nameCheck,
    orderingArticle: orderingCheck,
    statusArticle: statusCheck,
    categoryArticle: cateCheck,
    descriptionArticle: descCheck,
    authornArticle: authorCheck,
} = require('@validators');
const { articleController: controller } = require('@controllers');
const upload = multer({ dest: './public/backend/uploads' });

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Chuyển hướng trang tạo mới Item
router.get('/add', controller.renderAddPage);

// Thêm 1 Item
router.post(
    '/',
    upload.single('image'),
    [nameCheck, authorCheck, orderingCheck, statusCheck, cateCheck, descCheck],
    controller.addOne,
);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', controller.renderEditPage);

// Sửa 1 Item
router.post(
    '/edit',
    upload.single('image'),
    [nameCheck, authorCheck, orderingCheck, statusCheck, cateCheck, descCheck],
    controller.editOne,
);

// Sửa status của 1 Item
// router.get('(/:id/:status)?', controller.changeStatus);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

// Sửa ordering của 1 Item
router.get('/changeOrderingAjax/:id/:ordering', controller.changeOrderingAjax);

router.get('/getListCategoriesAjax/:category_id', controller.getListCategoriesAjax);

module.exports = router;
