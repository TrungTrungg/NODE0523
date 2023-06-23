const { nameItem, orderingItem, statusItem } = require('@validators/item_validator');
const { nameCategory, orderingCategory, statusCategory } = require('@validators/category_validator');
const {
    nameArticle,
    orderingArticle,
    statusArticle,
    categoryArticle,
    descriptionArticle,
    authorArticle,
    dateArticle,
    urlArticle,
    specialArticle,
} = require('@validators/article_validator');
const { nameSeries, orderingSeries, statusSeries, categorySeries, urlSeries } = require('@validators/series_validator');
const { resultsValidator } = require('@validators/resultsValidator');

module.exports = {
    // item
    nameItem,
    orderingItem,
    statusItem,
    // category
    nameCategory,
    orderingCategory,
    statusCategory,
    // article
    nameArticle,
    orderingArticle,
    statusArticle,
    categoryArticle,
    descriptionArticle,
    authorArticle,
    urlArticle,
    dateArticle,
    specialArticle,
    // series
    nameSeries,
    orderingSeries,
    statusSeries,
    categorySeries,
    urlSeries,

    resultsValidator,
};
