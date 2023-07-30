const fsHelper = require('@helpers/fs_helper');
const { categoryService, articleService } = require('@services');

const fetchDataFile = async (category_id) => {
    const timeExpired = 60 * 60 * 1000;
    if (!fsHelper.checkFileExist('src/files/blogData.txt')) {
        const { id: id_blog } = await categoryService.getIdByName('Tin tức');
        const [blogCategory, popularArticles, currentArticles, relatedArticles, articles] = await Promise.all([
            categoryService.getCategiresByCategoryId(id_blog),
            articleService.getArticleSpecial(category_id),
            articleService.getArticleCurrent(),
            articleService.getArticleRelated(category_id),
            articleService.getArticleWithCategory(category_id, { itemPerPage: 12, skip: 0 }),
        ]);

        fsHelper.writeFile('src/files/blogData.txt', {
            blogCategory,
            popularArticles,
            currentArticles,
            relatedArticles,
            articles,
            updated_at: new Date(),
        });
        return { blogCategory, popularArticles, currentArticles, relatedArticles, articles };
    }
    const fileData = fsHelper.readFile('src/files/blogData.txt', 'Async');
    if (fileData) {
        const jsonData = JSON.parse(fileData);
        if (new Date() - new Date(jsonData.updated_at) >= timeExpired) {
            const { id: id_blog } = await categoryService.getIdByName('Tin tức');
            const [blogCategory, popularArticles, currentArticles, relatedArticles, articles] = await Promise.all([
                categoryService.getCategiresByCategoryId(id_blog),
                articleService.getArticleSpecial(category_id),
                articleService.getArticleCurrent(),
                articleService.getArticleRelated(category_id),
                articleService.getArticleWithCategory(category_id, { itemPerPage: 12, skip: 0 }),
            ]);

            fsHelper.writeFile('src/files/blogData.txt', {
                blogCategory,
                popularArticles,
                currentArticles,
                relatedArticles,
                articles,
                updated_at: new Date(),
            });
            return { blogCategory, popularArticles, currentArticles, relatedArticles, articles };
        } else {
            return {
                blogCategory: jsonData.blogCategory,
                popularArticles: jsonData.popularArticles,
                currentArticles: jsonData.currentArticles,
                relatedArticles: jsonData.relatedArticles,
                articles: jsonData.articles,
            };
        }
    } else {
        const { id: id_blog } = await categoryService.getIdByName('Tin tức');
        const [blogCategory, popularArticles, currentArticles, relatedArticles, articles] = await Promise.all([
            categoryService.getCategiresByCategoryId(id_blog),
            articleService.getArticleSpecial(category_id),
            articleService.getArticleCurrent(),
            articleService.getArticleRelated(category_id),
            articleService.getArticleWithCategory(category_id, { itemPerPage: 12, skip: 0 }),
        ]);

        fsHelper.writeFile('src/files/blogData.txt', {
            blogCategory,
            popularArticles,
            currentArticles,
            relatedArticles,
            articles,
            updated_at: new Date(),
        });
        return { blogCategory, popularArticles, currentArticles, relatedArticles, articles };
    }
};

module.exports = { fetchDataFile };
