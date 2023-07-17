const { categoryService, settingService, articleService, userService } = require('@services');
const { catchAsync } = require('@helpers');

const fetchDataMiddleware = catchAsync(async (req, res, next) => {
    const [settings, mainCategories, subCategories, { id: shop_id }, recentPosts] = await Promise.all([
        settingService.getSetting(),
        categoryService.getMenuCategory(),
        categoryService.getSubCategory(),
        categoryService.getIdByName('Shop'),
        articleService.getArticleCurrent(),
    ]);
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    res.locals = {
        settings,
        mainCategories,
        subCategories,
        shop_id,
        recentPosts,
        messages,
    };
    next();
});

module.exports = fetchDataMiddleware;
