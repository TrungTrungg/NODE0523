const express = require('express');
const router = express.Router();

const mainCategoriesRouter = require('./mainCategories_router');
const articleCategoriesRouter = require('./articleCategories_router');
const productCategoriesRouter = require('./productCategories_router');

router.use('/main', mainCategoriesRouter);
router.use('/article', articleCategoriesRouter);
router.use('/product', productCategoriesRouter);

module.exports = router;
