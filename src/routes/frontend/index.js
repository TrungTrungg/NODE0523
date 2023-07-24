const express = require('express');
const router = express.Router();
const { authenticateToken } = require('@auth');
const { fetchDataMiddleware } = require('@middlewares/fetchData');

const homeRouter = require('./home_router');
const subscribeRouter = require('./subscribe_router');
const blogRouter = require('./blog_router');
const shopRouter = require('./shop_router');
const contactRouter = require('./contact_router');
const authRouter = require('./auth_router');
const userRouter = require('./user_router');
const cartRouter = require('./cart_router');
const checkoutRouter = require('./checkout_router');

router.use('/', authenticateToken, fetchDataMiddleware, (req, res, next) => {
    res.locals.layout = 'frontend';
    next();
}),
    router.use('/', homeRouter);
router.use('/subscribe', subscribeRouter);
router.use('/blog', blogRouter);
router.use('/shop', shopRouter);
router.use('/contact', contactRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/cart', cartRouter);
router.use('/checkout', checkoutRouter);

module.exports = router;
