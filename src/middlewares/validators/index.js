const { nameItem, orderingItem, statusItem } = require('@validators/item_validator');
const { nameCategory, orderingCategory, statusCategory } = require('@validators/category_validator');
const { nameArticle, orderingArticle, statusArticle } = require('@validators/article_validator');
const { resultsValidator } = require('@validators/resultsValidator');

module.exports = {
    nameItem,
    orderingItem,
    statusItem,
    nameCategory,
    orderingCategory,
    statusCategory,
    nameArticle,
    orderingArticle,
    statusArticle,
    resultsValidator,
};
