const express = require('express');
const router = express.Router();
const multer = require('multer');

const { validator } = require('@helpers');
const { userController: controller } = require('@controllers');
const upload = multer({ dest: './public/uploads/user' });

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', controller.renderList);

router.get('/changeStatusAjax/:id/:status', controller.changeStatusAjax);

module.exports = router;
