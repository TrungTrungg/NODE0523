const {
    itemValidator,
    categoryValidator,
    articleValidator,
    brandValidator,
    productValidator,
    subscribeValidator,
} = require('@validators');

const itemFormValidate = [itemValidator.nameCheck, itemValidator.orderingCheck, itemValidator.statusCheck];

const categoryFormValidate = [
    categoryValidator.nameCheck,
    categoryValidator.orderingCheck,
    categoryValidator.statusCheck,
    categoryValidator.urlCheck,
];

const brandFormValidate = [
    brandValidator.nameCheck,
    brandValidator.orderingCheck,
    brandValidator.statusCheck,
    brandValidator.specialCheck,
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
const productFormValidate = [
    productValidator.nameCheck,
    productValidator.orderingCheck,
    productValidator.statusCheck,
    productValidator.descriptionCheck,
    productValidator.categoryCheck,
];

const subscribeFormValidate = [subscribeValidator.mailCheck];

module.exports = {
    itemFormValidate,
    categoryFormValidate,
    brandFormValidate,
    articleFormValidate,
    productFormValidate,
    subscribeFormValidate,
};
