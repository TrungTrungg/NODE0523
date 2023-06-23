const express = require('express');
const router = express.Router();
const { categoryService, seriesService } = require('@services');
const { getListCategories } = require('@helpers');
const homeRouter = require('./home_router');

router.use('/', async (req, res, next) => {
    const mainCategories = await categoryService.getMainCategory();
    const subCategories = await categoryService.getSubCategory();
    const listSeries = await seriesService.getAllWithoutConditions();
    res.locals = {
        mainCategories,
        subCategories,
        listSeries,
    };
    res.locals.layout = 'frontend';
    next();
});

router.get('/', homeRouter);

module.exports = router;
