const { articleService, categoryService } = require('@services');
const { handlePagination, catchAsync, blogHelper } = require('@helpers');
const { blogCollection: collection } = require('@utils');

const renderBlog = catchAsync(async (req, res) => {
    // Lấy dữ liệu từ path
    const { slugId } = req.params;
    const { page } = req.query;
    let category_id = '';
    if (slugId) {
        const match = slugId.match(/([a-f0-9]+)$/i);
        category_id = match[1];
    }

    // Xử lý Page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    const totalItems = await articleService.countArticleByCategory(category_id);
    const pagination = handlePagination(totalItems, currentPage, (itemPerPage = 4));

    const articles = await articleService.getArticleWithCategory(category_id, pagination);
    const { blogCategory, popularArticles, currentArticles } = await blogHelper.fetchDataFile(category_id);

    const options = {
        title: 'Trang tin tức',
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
    const { slugId } = req.params;
    const match = slugId.match(/([a-f0-9]+)$/i);
    const id = match[1];

    const article = await articleService.getOneById(id);
    const { blogCategory, popularArticles, currentArticles, relatedArticles, articles } =
        await blogHelper.fetchDataFile(article.category_id);
    const options = {
        title: 'Trang chi tiết bài viết',
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
