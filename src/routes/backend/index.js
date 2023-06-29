const express = require('express');
const router = express.Router();

const dashboardRouter = require('./dashboard_router');
const itemRouter = require('./item_router');
const categoryRouter = require('./category_router');
const articleRouter = require('./article_router');
const seriesRouter = require('./series_router');
const subcribeRouter = require('./subcribe_router');

const settingRouter = require('./setting_router');

router.use('/', (req, res, next) => {
    res.locals.layout = 'backend';
    next();
});

router.use('/', dashboardRouter);
router.use('/item', itemRouter);
router.use('/category', categoryRouter);
router.use('/article', articleRouter);
router.use('/series', seriesRouter);
router.use('/subcribe', subcribeRouter);

router.use('/setting', settingRouter);

module.exports = router;
