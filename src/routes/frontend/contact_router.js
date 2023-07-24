const express = require('express');
const router = express.Router();

const { frontContactController: controller } = require('@controllers');

router.get('/', controller.renderContact);
router.post('/', controller.handleContactAjax);

module.exports = router;
