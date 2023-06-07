const express = require('express');
const router = express.Router();

const homeRouter = require('./home_router');

router.use('/', (req, res, next) => {
    res.locals.layout = 'frontend';
    next();
});

router.get('/', homeRouter);

module.exports = router;
