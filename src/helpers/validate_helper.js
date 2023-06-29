const {
    itemValidator,
    categoryValidator,
    articleValidator,
    seriesValidator,
    subcribeValidator,
} = require('@validators');

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

const subcribeFormValidate = [subcribeValidator.mailCheck];

module.exports = {
    itemFormValidate,
    categoryFormValidate,
    articleFormValidate,
    seriesFormValidate,
    subcribeFormValidate,
};
