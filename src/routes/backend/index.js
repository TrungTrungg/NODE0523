const express = require('express');
const router = express.Router();

const dashboardRouter = require('./dashboard_router');
const itemRouter = require('./item_router');
const categoryRouter = require('./category_router');
const articleRouter = require('./article_router');

router.use('/', (req, res, next) => {
    res.locals.layout = 'backend';
    next();
});

router.use('/', dashboardRouter);
router.use('/item', itemRouter);
router.use('/category', categoryRouter);
router.use('/article', articleRouter);

module.exports = router;
