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
const orderRouter = require('./order_router');
const couponRouter = require('./coupon_router');
const deliveryRouter = require('./delivery_router');
const advertiseRouter = require('./advertise_router');

const settingRouter = require('./setting_router');

router.use('/', (req, res, next) => {
    if (req.app.locals.user) {
        if (req.app.locals.user.is_admin) {
            res.locals.layout = 'backend';
            next();
        } else {
            res.redirect('back');
        }
    } else {
        res.redirect('back');
    }
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
router.use('/order', orderRouter);
router.use('/coupon', couponRouter);
router.use('/delivery', deliveryRouter);
router.use('/advertise', advertiseRouter);

router.use('/setting', settingRouter);

module.exports = router;
