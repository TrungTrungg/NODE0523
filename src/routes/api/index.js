const express = require('express');
const router = express.Router();
const { userService, deliveryService } = require('@services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mainCategoryRouter = require('./mainCategory_controller');

router.use('/', (req, res, next) => {
    res.locals.layout = 'api';
    next();
});

router.use('/mainCategory', mainCategoryRouter);

module.exports = router;
