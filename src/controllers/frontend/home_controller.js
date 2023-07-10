const { articleService, productService, brandService, sliderService } = require('@services');
const { catchAsync } = require('@helpers');

const renderHome = catchAsync(async (req, res) => {
    let category_id = '';
    const [sliders, articles, recentProd, popularProd, specialProd, brands] = await Promise.all([
        // sliders
        sliderService.getAllForHome(),
        // articles
        articleService.getArticleSpecial(),
        // recent products
        productService.getByCondition(category_id, '', 4),
        // popular products
        productService.getByCondition(category_id, 'popular', 4),
        // special products
        productService.getByCondition(category_id, 'special', 4),
        // brands
        brandService.getAllBrands(15),
    ]);
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        sliders,
        articles,
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
