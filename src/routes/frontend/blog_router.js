const express = require('express');
const router = express.Router();

const { blogController: controller } = require('@controllers');

router.get('/:slugId', controller.renderDetailBlog);

router.get('(/:mainSlug/:slugId)?', controller.renderBlog);

module.exports = router;
