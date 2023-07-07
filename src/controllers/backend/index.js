// backend
const itemController = require('@controllers/backend/item_controller');

const mainCategoriesController = require('@controllers/backend/category/mainCategories_controller');
const articleCategoriesController = require('@controllers/backend/category/articleCategories_controller');
const productCategoriesController = require('@controllers/backend/category/productCategories_controller');

const brandController = require('@controllers/backend/brand_controller');
const productController = require('@controllers/backend/product_controller');

const articleController = require('@controllers/backend/article_controller');
const subscribeController = require('@controllers/backend/subscribe_controller');

const settingController = require('@controllers/backend/setting_controller');

module.exports = {
    itemController,
    mainCategoriesController,
    articleCategoriesController,
    productCategoriesController,
    brandController,
    productController,
    articleController,
    subscribeController,
    settingController,
};
