const express = require('express');
const router = express.Router();
const { userService, deliveryService, productService, brandService } = require('@services');
const { brandModel, productModel } = require('@models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mainCategoryRouter = require('./mainCategory_controller');

router.use('/', (req, res, next) => {
    res.locals.layout = 'api';
    next();
});

router.get('/tool', async (req, res) => {
    const products = await productModel.find();

    const promises = products.map(async (product) => {
        if (product.name.match(/corsair/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64a188fa62e3b8e0c925d0d5' });
        }
        if (product.name.match(/intel/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64a1891262e3b8e0c925d0e8' });
        }
        if (product.name.match(/kingston/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c54a892edaf5703546babc' });
        }
        if (product.name.match(/amd/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c54ab02edaf5703546badd' });
        }
        if (product.name.match(/logitech/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c60c0b7ab7e5148ccaed97' });
        }
        if (product.name.match(/dell/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c60c417ab7e5148ccaedca' });
        }
        if (product.name.match(/hp/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c60c517ab7e5148ccaede3' });
        }
        if (product.name.match(/msi/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c60c607ab7e5148ccaedfc' });
        }
        if (product.name.match(/razer/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c60c717ab7e5148ccaee15' });
        }
        if (product.name.match(/gigabyte/i)) {
            await productModel.updateOne({ name: product.name }, { brand_id: '64c61a7e0a35ea783ee50f06' });
        }
    });
    const result = await Promise.all(promises);
    res.send(result);
});

router.use('/mainCategory', mainCategoryRouter);

module.exports = router;
