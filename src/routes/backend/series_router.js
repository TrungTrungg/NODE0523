const express = require('express');
const router = express.Router();

const {
    nameSeries: nameCheck,
    orderingSeries: orderingCheck,
    statusSeries: statusCheck,
    categorySeries: categoryCheck,
    urlSeries: urlCheck,
} = require('@validators');

const { seriesController: controller } = require('@controllers');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Chuyển hướng trang tạo mới Item
router.get('/add', controller.renderAddPage);

// Thêm 1 Item
router.post('/', [nameCheck, orderingCheck, statusCheck, categoryCheck, urlCheck], controller.addOne);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', controller.renderEditPage);

// Sửa 1 Item
router.post('/edit', [nameCheck, orderingCheck, statusCheck, categoryCheck, urlCheck], controller.editOne);

// Sửa status của 1 Item
// router.get('(/:id/:status)?', controller.changeStatus);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

// Sửa ordering của 1 Item
router.get('/changeOrderingAjax/:id/:ordering', controller.changeOrderingAjax);

router.get('/getListCategoriesAjax/:category_id', controller.getListCategoriesAjax);

router.get('/changeUrlAjax/:id/:url', controller.changeUrlAjax);

module.exports = router;
