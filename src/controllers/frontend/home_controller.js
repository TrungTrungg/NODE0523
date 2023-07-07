const { articleService, settingService, productService, brandService } = require('@services');
const { catchAsync } = require('@helpers');

const renderHome = catchAsync(async (req, res) => {
    const {
        info: infoSetting,
        purchase: purchaseSetting,
        discount: discountSetting,
    } = await settingService.getSetting();
    const articles = await articleService.getArticleSpecial();
    let category_id = '';
    // recent products
    const recentProd = await productService.getByCondition(category_id, '', 4);

    // popular products
    const popularProd = await productService.getByCondition(category_id, 'popular', 4);

    // special products
    const specialProd = await productService.getByCondition(category_id, 'special', 4);

    const brands = await brandService.getAllBrands(15);
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        articles,
        infoSetting,
        purchaseSetting,
        discountSetting,
        recentProd,
        popularProd,
        specialProd,
        brands,
        messages,
    };
    res.render('frontend/pages/home', options);
});

module.exports = {
    renderHome,
};
