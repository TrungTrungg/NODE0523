// backend
const itemController = require('@controllers/item_controller');
const categoryController = require('@controllers/category_controller');
const articleController = require('@controllers/article_controller');
const seriesController = require('@controllers/series_controller');

// frontend
const homeController = require('@controllers/home_controller');

module.exports = {
    itemController,
    categoryController,
    articleController,
    seriesController,

    homeController,
};
