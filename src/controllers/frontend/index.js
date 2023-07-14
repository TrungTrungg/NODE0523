// frontend
const homeController = require('@controllers/frontend/home_controller');
const blogController = require('@controllers/frontend/blog_controller');
const shopController = require('@controllers/frontend/shop_controller');
const frontContactController = require('@controllers/frontend/contact_controller');
const authController = require('@controllers/frontend/auth_controller');
const cartController = require('@controllers/frontend/cart_controller');
const checkoutController = require('@controllers/frontend/checkout_controller');

module.exports = {
    homeController,
    blogController,
    shopController,
    frontContactController,
    authController,
    cartController,
    checkoutController,
};
