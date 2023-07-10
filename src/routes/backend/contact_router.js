const express = require('express');
const router = express.Router();

const { contactController: controller } = require('@controllers');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

// Xóa 1 Item
router.get('/delete/:id', controller.deleteOne);

router.post('/', controller.addContact);

// Sửa status của 1 Item
// router.get('(/:id/:status)?', controller.changeStatus);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

// Sửa ordering của 1 Item
router.get('/changeOrderingAjax/:id/:ordering', controller.changeOrderingAjax);

router.get('/changeUrlAjax/:id/:url', controller.changeUrlAjax);

module.exports = router;
