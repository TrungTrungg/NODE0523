const express = require('express');
const router = express.Router();

const { homeController: controller } = require('@controllers');

router.get('/', controller.renderHome);

module.exports = router;
