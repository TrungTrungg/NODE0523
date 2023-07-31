const { itemValidator, itemCollection } = require('@utils/item_util');
const {
    categoryValidator,
    mainCategoriesCollection,
    articleCategoriesCollection,
    productCategoriesCollection,
} = require('@utils/category_util');
const { brandValidator, brandCollection } = require('@utils/brand_util');
const { productValidator, productCollection, productPrice } = require('@utils/product_util');
const { articleValidator, articleCollection } = require('@utils/article_util');
const { sliderValidator, sliderCollection } = require('@utils/slider_util');
const { userValidator, userCollection } = require('@utils/user_util');
const { orderCollection } = require('@utils/order_util');
const { filterOptions, orderStatusOptions } = require('@utils/status_util');
const notify = require('@utils/notify_util');

module.exports = {
    itemCollection,
    itemValidator,
    mainCategoriesCollection,
    articleCategoriesCollection,
    productCategoriesCollection,
    categoryValidator,
    brandValidator,
    brandCollection,
    productValidator,
    productCollection,
    productPrice,
    articleCollection,
    articleValidator,
    sliderValidator,
    sliderCollection,
    contactCollection: 'contact',
    couponCollection: 'coupon',
    deliveryCollection: 'delivery',
    advertiseCollection: 'advertise',
    orderCollection,

    userValidator,
    userCollection,
    blogCollection: 'blog',
    shopCollection: 'shop',
    cartCollection: 'cart',
    checkoutCollection: 'checkout',

    filterOptions,
    orderStatusOptions,
    notify,
};
