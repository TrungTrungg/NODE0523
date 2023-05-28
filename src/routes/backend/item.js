const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('backend/pages/item');
});

router.get('/form', (req, res, next) => {
    res.render('backend/pages/form');
});

module.exports = router;
