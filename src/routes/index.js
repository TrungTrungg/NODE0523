const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontend');
const backendRouter = require('./backend');

const apiRouter = require('./api');

router.use('/admin', backendRouter);
router.use('/', frontendRouter);

router.use('/api', apiRouter);

module.exports = router;
