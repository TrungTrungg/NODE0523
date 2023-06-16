const express = require('express');
const router = express.Router();

const apiRouter = require('./api');
const dashboardRouter = require('./dashboard_router');
const itemRouter = require('./item_router');
const categoryRouter = require('./category_router');

router.use('/', (req, res, next) => {
    res.locals.layout = 'backend';
    next();
});

router.use('/api', apiRouter);
router.use('/', dashboardRouter);
router.use('/item', itemRouter);
router.use('/category', categoryRouter);

module.exports = router;
