const express = require('express');
const router = express.Router();

const { cateService, itemService } = require('@services');
router.post('/add', async (req, res, next) => {
    const { name } = req.body;
    await cateService.addCate(name);
    const cate = await cateService.getCate();
    res.send(cate);
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const getItem = await itemService.getItemByCateId(id);
    res.send(getItem);
});

module.exports = router;
