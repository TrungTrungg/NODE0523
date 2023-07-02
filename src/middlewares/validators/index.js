const itemValidator = require('@validators/item_validator');
const categoryValidator = require('@validators/category_validator');
const articleValidator = require('@validators/article_validator');
const brandValidator = require('@validators/brand_validator');
const productValidator = require('@validators/product_validator');
const seriesValidator = require('@validators/series_validator');
const subscribeValidator = require('@validators/subscribe_validator');
const { resultsValidator } = require('@validators/resultsValidator');

module.exports = {
    itemValidator,
    categoryValidator,
    articleValidator,
    brandValidator,
    productValidator,
    seriesValidator,
    subscribeValidator,
    resultsValidator,
};
