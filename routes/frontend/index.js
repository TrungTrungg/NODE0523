const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('frontend/index', { part: 'Front-end' });
});

module.exports = router;
