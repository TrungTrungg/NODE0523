const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontend');
const backendRouter = require('./backend');

router.use('/admin', backendRouter);
router.use('/', frontendRouter);

module.exports = router;
