// backend
const itemController = require('@controllers/backend/item_controller');
const dashboardController = require('@controllers/backend/dashboard_controller');

const mainCategoriesController = require('@controllers/backend/category/mainCategories_controller');
const articleCategoriesController = require('@controllers/backend/category/articleCategories_controller');
const productCategoriesController = require('@controllers/backend/category/productCategories_controller');

const brandController = require('@controllers/backend/brand_controller');
const productController = require('@controllers/backend/product_controller');
const orderController = require('@controllers/backend/order_controller');
const couponController = require('@controllers/backend/coupon_controller');

const articleController = require('@controllers/backend/article_controller');
const subscribeController = require('@controllers/backend/subscribe_controller');
const sliderController = require('@controllers/backend/slider_controller');
const contactController = require('@controllers/backend/contact_controller');
const deliveryController = require('@controllers/backend/delivery_controller');
const advertiseController = require('@controllers/backend/advertise_controller');

const userController = require('@controllers/backend/user_controller');

const settingController = require('@controllers/backend/setting_controller');

module.exports = {
    itemController,
    dashboardController,
    mainCategoriesController,
    articleCategoriesController,
    productCategoriesController,
    brandController,
    productController,
    articleController,
    subscribeController,
    sliderController,
    contactController,
    settingController,
    orderController,
    couponController,
    deliveryController,
    advertiseController,
    userController,
};
