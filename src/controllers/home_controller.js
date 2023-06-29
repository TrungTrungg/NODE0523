const { articleService, settingService } = require('@services');

const renderHome = async (req, res) => {
    const {
        info: infoSetting,
        purchase: purchaseSetting,
        discount: discountSetting,
    } = await settingService.getSetting();
    const articles = await articleService.getArticleSpecial();
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = { articles, infoSetting, purchaseSetting, discountSetting, messages };
    res.render('frontend/pages/home', options);
};

module.exports = {
    renderHome,
};
