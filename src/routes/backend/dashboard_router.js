const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('backend/pages/dashboard', { page: 'Dashboard' });
});

module.exports = router;
