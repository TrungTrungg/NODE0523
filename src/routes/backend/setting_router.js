const express = require('express');
const router = express.Router();
const multer = require('multer');

const { settingController: controller } = require('@controllers');
const upload = multer({ dest: './public/uploads/setting' });

router.get('/', controller.renderSetting);
router.post(
    '/',
    upload.fields([{ name: 'headerLogo' }, { name: 'discountImage' }, { name: 'footerLogo' }]),
    controller.handleUpdateSetting,
);

module.exports = router;
