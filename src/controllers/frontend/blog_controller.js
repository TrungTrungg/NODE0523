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

    const { id: id_blog } = await categoryService.getIdByName('Tin tức');
    const totalItems = await articleService.countArticleByCategory(category_id);
    const pagination = await handlePagination(totalItems, currentPage, (itemPerPage = 4));
    const [blogCategory, articles, popularArticles, currentArticles] = await Promise.all([
        categoryService.getCategiresByCategoryId(id_blog),
        articleService.getArticleWithCategory(category_id, pagination),
        articleService.getArticleSpecial(category_id),
        articleService.getArticleCurrent(),
    ]);
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

const renderDetailBlog = catchAsync(async (req, res) => {
    const { id } = req.params;
    const article = await articleService.getOneById(id);
    const { id: id_blog } = await categoryService.getIdByName('Tin tức');
    const [blogCategory, articles, popularArticles, currentArticles, relatedArticles] = await Promise.all([
        categoryService.getCategiresByCategoryId(id_blog),
        articleService.getArticleWithCategory(article.category_id, { itemPerPage: 12, skip: 0 }),
        articleService.getArticleSpecial(article.category_id),
        articleService.getArticleCurrent(),
        articleService.getArticleRelated(article.category_id),
    ]);
    const options = {
        page: 'Trang tin tức',
        pageDesc: 'Những tin mới nhất',
        collection,
        article,
        articles,
        popularArticles,
        currentArticles,
        relatedArticles,
        blogCategory,
    };
    res.render('frontend/pages/blog/detail', options);
});
module.exports = {
    renderBlog,
    renderDetailBlog,
};
