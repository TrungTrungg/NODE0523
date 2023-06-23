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
} = require('@validators');

const articleValidateForm = [
    nameArticle,
    orderingArticle,
    statusArticle,
    descriptionArticle,
    authorArticle,
    dateArticle,
    specialArticle,
    urlArticle,
];

module.exports = {
    articleValidateForm,
};
