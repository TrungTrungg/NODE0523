const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('backend/index', { part: 'Back-end' });
});

module.exports = router;
