const { itemValidator, categoryValidator, articleValidator, seriesValidator } = require('@validators');

const itemFormValidate = [itemValidator.nameCheck, itemValidator.orderingCheck, itemValidator.statusCheck];

const categoryFormValidate = [
    categoryValidator.nameCheck,
    categoryValidator.orderingCheck,
    categoryValidator.statusCheck,
    categoryValidator.urlCheck,
];

const articleFormValidate = [
    articleValidator.nameCheck,
    articleValidator.orderingCheck,
    articleValidator.statusCheck,
    articleValidator.descriptionCheck,
    articleValidator.authorCheck,
    articleValidator.dateCheck,
    articleValidator.specialCheck,
    articleValidator.urlCheck,
    articleValidator.categoryCheck,
];

const seriesFormValidate = [
    seriesValidator.nameCheck,
    seriesValidator.orderingCheck,
    seriesValidator.statusCheck,
    seriesValidator.urlCheck,
    seriesValidator.categoryCheck,
];

module.exports = {
    itemFormValidate,
    categoryFormValidate,
    articleFormValidate,
    seriesFormValidate,
};
