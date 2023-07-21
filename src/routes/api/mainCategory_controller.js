const express = require('express');
const router = express.Router();

const { matchedData } = require('express-validator');
const unidecode = require('unidecode');
const { validator } = require('@helpers');
const { categoryModel: model } = require('@models');
const { categoryService: service } = require('@services');
const { resultsValidator } = require('@validators');

router.get('/list', async (req, res) => {
    const { skip } = req.params;
    const items = await model.find({ category_id: { $in: ['', '64a13979632ad990660121c8'] } });
    res.send(items);
});

router.get('/one/:id', async (req, res) => {
    const { id } = req.params;
    const item = await model.findById(id);
    res.send(item);
});
router.post('/create', validator.categoryFormValidate, async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, errors });
    } else {
        const { name, url, status, ordering } = matchedData(req);
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        const result = await service.create(name, slug, status.toLowerCase(), ordering, url);
        res.send({ success: true, result });
    }
});

module.exports = router;
