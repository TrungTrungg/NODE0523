const express = require('express');
const router = express.Router();

const homeRouter = require('./home');

router.use('/', (req, res, next) => {
    res.locals.layout = 'frontend/index';
    next();
});

router.get('/', homeRouter);

module.exports = router;
