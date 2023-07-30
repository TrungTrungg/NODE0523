const { catchAsync, homeHelper } = require('@helpers');

const renderHome = catchAsync(async (req, res) => {
    const { sliders, articles, recentProd, popularProd, specialProd, brands } = await homeHelper.fetchDataFile('');
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
