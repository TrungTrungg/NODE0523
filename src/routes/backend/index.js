const express = require('express');
const router = express.Router();

const dashboardRouter = require('./dashboard_router');
const itemRouter = require('./item_router');
const categoryRouter = require('./category');
const brandRouter = require('./brand_router');
const productRouter = require('./product_router');
const articleRouter = require('./article_router');
const subscribeRouter = require('./subscribe_router');
const sliderRouter = require('./slider_router');
const contactRouter = require('./contact_router');
const userRouter = require('./user_router');

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
router.use('/article', articleRouter);
router.use('/subscribe', subscribeRouter);
router.use('/slider', sliderRouter);
router.use('/contact', contactRouter);
router.use('/user', userRouter);

router.use('/setting', settingRouter);

module.exports = router;
