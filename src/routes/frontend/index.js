const express = require('express');
const router = express.Router();
const { categoryService, settingService } = require('@services');

const homeRouter = require('./home_router');
const blogRouter = require('./blog_router');
const shopRouter = require('./shop_router');

router.use('/', async (req, res, next) => {
    const { header, footer } = await settingService.getSetting();
    const { id } = await categoryService.getShopCategoriesID();
    const mainCategories = await categoryService.getMenuCategory(id);
    const subCategories = await categoryService.getSubCategory();
    const { id: shop_id } = await categoryService.getShopCategoriesID();

    res.locals = {
        header,
        footer,
        mainCategories,
        subCategories,
        shop_id,
    };
    res.locals.layout = 'frontend';
    next();
});

router.use('/', homeRouter);
router.use('/blog', blogRouter);
router.use('/shop', shopRouter);

module.exports = router;
