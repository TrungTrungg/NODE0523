const express = require('express');
const router = express.Router();
const { itemApiController } = require('@controllers/api');

router.get('/', itemApiController.get_item);

module.exports = router;
