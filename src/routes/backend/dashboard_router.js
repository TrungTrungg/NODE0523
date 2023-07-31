const express = require('express');
const router = express.Router();
const { dashboardController: controller } = require('@controllers');

router.get('/', controller.renderDashboard);
router.get('/updateData', controller.updateDataAjax);

module.exports = router;
