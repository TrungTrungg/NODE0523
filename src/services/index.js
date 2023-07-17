const itemService = require('@services/item_service');
const categoryService = require('@services/category_service');
const brandService = require('@services/brand_service');
const productService = require('@services/product_service');
const articleService = require('@services/article_service');
const subscribeService = require('@services/subscribe_service');
const sliderService = require('@services/slider_service');
const contactService = require('@services/contact_service');
const userService = require('@services/user_service');
const orderService = require('@services/order_service');
const couponService = require('@services/coupon_service');
const deliveryService = require('@services/delivery_service');

const settingService = require('@services/setting_service');

module.exports = {
    itemService,
    categoryService,
    brandService,
    productService,
    articleService,
    subscribeService,
    sliderService,
    contactService,
    userService,
    settingService,
    orderService,
    couponService,
    deliveryService,
};
