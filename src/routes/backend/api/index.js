const express = require('express');
const router = express.Router();

const itemApiRouter = require('./item_api_router');

router.use('/item', itemApiRouter);

module.exports = router;
