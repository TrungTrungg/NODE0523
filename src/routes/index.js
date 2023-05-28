const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontend');
const backendRouter = require('./backend');

router.use('/', frontendRouter);
router.use('/admin', backendRouter);

module.exports = router;
