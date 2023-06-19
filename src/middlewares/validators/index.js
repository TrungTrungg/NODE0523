const { nameItem, orderingItem, statusItem } = require('@validators/item_validator');
const { nameCategory, orderingCategory, statusCategory, category } = require('@validators/category_validator');
const {
    nameArticle,
    orderingArticle,
    statusArticle,
    categoryArticle,
    descriptionArticle,
    authornArticle,
} = require('@validators/article_validator');
const { resultsValidator } = require('@validators/resultsValidator');

module.exports = {
    nameItem,
    orderingItem,
    statusItem,
    nameCategory,
    orderingCategory,
    statusCategory,
    category,
    nameArticle,
    orderingArticle,
    statusArticle,
    resultsValidator,
    categoryArticle,
    descriptionArticle,
    authornArticle,
};
