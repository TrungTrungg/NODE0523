// backend
const itemController = require('@controllers/item_controller');
const categoryController = require('@controllers/category_controller');
const articleController = require('@controllers/article_controller');
const seriesController = require('@controllers/series_controller');
const subcribeController = require('@controllers/subcribe_controller');

const settingController = require('@controllers/setting_controller');

// frontend
const homeController = require('@controllers/home_controller');
const blogController = require('@controllers/blog_controller');

module.exports = {
    itemController,
    categoryController,
    articleController,
    seriesController,
    subcribeController,
    settingController,

    homeController,
    blogController,
};
