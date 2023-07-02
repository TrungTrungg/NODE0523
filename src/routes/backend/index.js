const express = require('express');
const router = express.Router();

const dashboardRouter = require('./dashboard_router');
const itemRouter = require('./item_router');
const categoryRouter = require('./category');
const brandRouter = require('./brand_router');
const productRouter = require('./product_router');
const seriesRouter = require('./series_router');
const articleRouter = require('./article_router');
const subscribeRouter = require('./subscribe_router');

const settingRouter = require('./setting_router');

router.use('/', (req, res, next) => {
    res.locals.layout = 'backend';
    next();
});

router.use('/', dashboardRouter);
router.use('/item', itemRouter);
router.use('/category', categoryRouter);
router.use('/brand', brandRouter);
router.use('/product', productRouter);
router.use('/series', seriesRouter);
router.use('/article', articleRouter);
router.use('/subscribe', subscribeRouter);

router.use('/setting', settingRouter);

module.exports = router;
