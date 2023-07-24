// frontend
const homeController = require('@controllers/frontend/home_controller');
const frontSubscribeController = require('@controllers/frontend/subscribe_controller');
const blogController = require('@controllers/frontend/blog_controller');
const shopController = require('@controllers/frontend/shop_controller');
const frontContactController = require('@controllers/frontend/contact_controller');
const authController = require('@controllers/frontend/auth_controller');
const frontUserController = require('@controllers/frontend/user_controller');
const cartController = require('@controllers/frontend/cart_controller');
const checkoutController = require('@controllers/frontend/checkout_controller');

module.exports = {
    homeController,
    frontSubscribeController,
    blogController,
    shopController,
    frontContactController,
    authController,
    frontUserController,
    cartController,
    checkoutController,
};
