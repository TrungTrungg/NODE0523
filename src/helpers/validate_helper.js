const {
    itemValidator,
    categoryValidator,
    articleValidator,
    brandValidator,
    productValidator,
    subscribeValidator,
    userValidator,
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
    articleValidator.authorCheck,
    articleValidator.statusCheck,
    articleValidator.specialCheck,
    articleValidator.orderingCheck,
    articleValidator.descriptionCheck,
    articleValidator.categoryCheck,
];
const productFormValidate = [
    productValidator.nameCheck,
    productValidator.orderingCheck,
    productValidator.statusCheck,
    productValidator.descriptionCheck,
    productValidator.categoryCheck,
];

const userRegisterFormValidate = [
    userValidator.fnameCheck,
    userValidator.lnameCheck,
    userValidator.addressCheck,
    userValidator.phoneCheck,
    userValidator.emailCheck,
    userValidator.passwordCheck,
    userValidator.comfirmPasswordCheck,
];
const userLoginFormValidate = [userValidator.emailLoginCheck, userValidator.passwordLoginCheck];

const subscribeFormValidate = [subscribeValidator.mailCheck];

module.exports = {
    itemFormValidate,
    categoryFormValidate,
    brandFormValidate,
    articleFormValidate,
    productFormValidate,
    subscribeFormValidate,
    userRegisterFormValidate,
    userLoginFormValidate,
};
