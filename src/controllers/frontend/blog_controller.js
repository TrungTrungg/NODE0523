const { articleService, categoryService } = require('@services');
const { handlePagination, catchAsync } = require('@helpers');
const { blogCollection: collection } = require('@utils');

const renderBlog = catchAsync(async (req, res) => {
    // Lấy dữ liệu từ path
    const { category_id } = req.params;
    const { page } = req.query;

    // Xử lý Page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    const totalItems = await articleService.countArticleByCategory(category_id);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 4));
    const blogCategory = await categoryService.getBlogCategory();
    const articles = await articleService.getArticleWithCategory(category_id, pagination);
    const popularArticles = await articleService.getArticleSpecial(category_id);
    const currentArticles = await articleService.getArticleCurrent(category_id);

    const options = {
        page: 'Trang tin tức',
        pageDesc: 'Những tin mới nhất',
        collection,
        articles,
        popularArticles,
        currentArticles,
        blogCategory,
        pagination,
        category_id,
    };
    res.render('frontend/pages/blog', options);
});

module.exports = {
    renderBlog,
};
