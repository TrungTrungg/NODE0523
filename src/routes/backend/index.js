const express = require('express');
const router = express.Router();

const dashboardRouter = require('./dashboard');
const itemRouter = require('./item');

router.use('/', (req, res, next) => {
    res.locals.layout = 'backend/index';
    next();
});

router.use('/', dashboardRouter);
router.use('/item', itemRouter);

module.exports = router;
