const express = require('express');
const router = express.Router();

const { frontUserController: controller } = require('@controllers');

router.get('/', controller.renderUserInfo);

module.exports = router;
