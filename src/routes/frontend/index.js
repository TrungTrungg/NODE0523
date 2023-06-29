const express = require('express');
const router = express.Router();
const { categoryService, seriesService, settingService } = require('@services');

const homeRouter = require('./home_router');
const blogRouter = require('./blog_router');

router.use('/', async (req, res, next) => {
    const { header, footer } = await settingService.getSetting();
    const mainCategories = await categoryService.getMainCategory();
    const subCategories = await categoryService.getSubCategory();
    const listSeries = await seriesService.getAllWithoutConditions();
    const menuItems = [...mainCategories, ...subCategories, ...listSeries];
    res.locals = {
        header,
        footer,
        mainCategories,
        subCategories,
        listSeries,
        menuItems,
    };
    res.locals.layout = 'frontend';
    next();
});

router.use('/', homeRouter);
router.use('/blog', blogRouter);

module.exports = router;
