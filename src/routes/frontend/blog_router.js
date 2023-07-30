const express = require('express');
const router = express.Router();

const { blogController: controller } = require('@controllers');

router.get('/', controller.renderBlog);
router.get('/:slugId', controller.renderBlog);
router.get('/article/:slugId', controller.renderDetailBlog);

module.exports = router;
