const { articleService } = require('@services');

const renderHome = async (req, res) => {
    const articles = await articleService.getArticleSpecial();
    const options = { articles };
    res.render('frontend/pages/home', options);
};

module.exports = {
    renderHome,
};
