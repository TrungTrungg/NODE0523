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
const { filterOptions } = require('@utils/status_util');
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

    blogCollection: 'blog',
    shopCollection: 'shop',
    filterOptions,
    notify,
};
