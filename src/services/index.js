const itemService = require('@services/item_service');
const categoryService = require('@services/category_service');
const brandService = require('@services/brand_service');
const productService = require('@services/product_service');
const articleService = require('@services/article_service');
const seriesService = require('@services/series_service');
const subscribeService = require('@services/subscribe_service');

const settingService = require('@services/setting_service');

module.exports = {
    itemService,
    categoryService,
    brandService,
    productService,
    articleService,
    seriesService,
    subscribeService,

    settingService,
};
