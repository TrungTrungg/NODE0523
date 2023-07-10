const express = require('express');
const router = express.Router();
const { categoryService, settingService, articleService } = require('@services');

const homeRouter = require('./home_router');
const blogRouter = require('./blog_router');
const shopRouter = require('./shop_router');
const contactRouter = require('./contact_router');
const { catchAsync } = require('@helpers');

const fetchDataMiddleware = catchAsync(async (req, res, next) => {
    const [settings, mainCategories, subCategories, { id: shop_id }, recentPosts] = await Promise.all([
        settingService.getSetting(),
        categoryService.getMenuCategory(),
        categoryService.getSubCategory(),
        categoryService.getShopCategoriesID(),
        articleService.getArticleCurrent(),
    ]);
    res.locals = {
        settings,
        mainCategories,
        subCategories,
        shop_id,
        recentPosts,
    };
    next();
});

router.use('/', fetchDataMiddleware, async (req, res, next) => {
    res.locals.layout = 'frontend';
    next();
});

router.use('/', homeRouter);
router.use('/blog', blogRouter);
router.use('/shop', shopRouter);
router.use('/contact', contactRouter);

module.exports = router;
