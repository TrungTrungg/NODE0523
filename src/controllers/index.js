// backend
const itemController = require('@controllers/item_controller');

const mainCategoriesController = require('@controllers/category/mainCategories_controller');
const articleCategoriesController = require('@controllers/category/articleCategories_controller');
const productCategoriesController = require('@controllers/category/productCategories_controller');

const brandController = require('@controllers/brand_controller');
const productController = require('@controllers/product_controller');

const seriesController = require('@controllers/series_controller');
const articleController = require('@controllers/article_controller');
const subscribeController = require('@controllers/subscribe_controller');

const settingController = require('@controllers/setting_controller');

// frontend
const homeController = require('@controllers/home_controller');
const blogController = require('@controllers/blog_controller');

module.exports = {
    itemController,
    mainCategoriesController,
    articleCategoriesController,
    productCategoriesController,
    brandController,
    productController,
    articleController,
    seriesController,
    subscribeController,
    settingController,

    homeController,
    blogController,
};
