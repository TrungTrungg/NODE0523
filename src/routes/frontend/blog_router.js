const express = require('express');
const router = express.Router();

const { blogController: controller } = require('@controllers');

router.get('/:category_id', controller.renderBlog);
router.get('/article/:id', controller.renderDetailBlog);

module.exports = router;
