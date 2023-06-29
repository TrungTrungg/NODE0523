const itemValidator = require('@validators/item_validator');
const categoryValidator = require('@validators/category_validator');
const articleValidator = require('@validators/article_validator');
const seriesValidator = require('@validators/series_validator');
const subcribeValidator = require('@validators/subcribe_validator');
const { resultsValidator } = require('@validators/resultsValidator');

module.exports = {
    itemValidator,
    categoryValidator,
    articleValidator,
    seriesValidator,
    subcribeValidator,
    resultsValidator,
};
