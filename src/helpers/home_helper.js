const fsHelper = require('@helpers/fs_helper');
const { articleService, productService, brandService, sliderService } = require('@services');

const fetchDataFile = async (category_id) => {
    const timeExpired = 60 * 60 * 1000;
    if (!fsHelper.checkFileExist('src/files/blogData.txt')) {
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

        fsHelper.writeFile('src/files/blogData.txt', {
            sliders,
            articles,
            recentProd,
            popularProd,
            specialProd,
            brands,
            updated_at: new Date(),
        });
        return { sliders, articles, recentProd, popularProd, specialProd, brands };
    }
    const fileData = fsHelper.readFile('src/files/blogData.txt', 'Async');
    if (fileData) {
        const jsonData = JSON.parse(fileData);
        if (new Date() - new Date(jsonData.updated_at) >= timeExpired) {
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

            fsHelper.writeFile('src/files/blogData.txt', {
                sliders,
                articles,
                recentProd,
                popularProd,
                specialProd,
                brands,
                updated_at: new Date(),
            });
            return { sliders, articles, recentProd, popularProd, specialProd, brands };
        } else {
            return {
                sliders: jsonData.sliders,
                articles: jsonData.articles,
                recentProd: jsonData.recentProd,
                popularProd: jsonData.popularProd,
                specialProd: jsonData.specialProd,
                brands: jsonData.brands,
            };
        }
    } else {
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

        fsHelper.writeFile('src/files/blogData.txt', {
            sliders,
            articles,
            recentProd,
            popularProd,
            specialProd,
            brands,
            updated_at: new Date(),
        });
        return { sliders, articles, recentProd, popularProd, specialProd, brands };
    }
};

module.exports = { fetchDataFile };
