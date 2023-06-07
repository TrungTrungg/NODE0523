const express = require('express');
const router = express.Router();

const dashboardRouter = require('./dashboard_router');
const itemRouter = require('./item_router');

router.use('/', (req, res, next) => {
    res.locals.layout = 'backend';
    next();
});

router.use('/', dashboardRouter);
router.use('/item', itemRouter);

module.exports = router;
