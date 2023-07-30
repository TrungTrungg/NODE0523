const fsHelper = require('@helpers/fs_helper');
const { categoryService, productService, brandService } = require('@services');

const fetchDataFile = async (category_id) => {
    const timeExpired = 60 * 60 * 1000;
    if (!fsHelper.checkFileExist('src/files/shopData.txt')) {
        const { id: shop_id } = await categoryService.getIdByName('Shop');
        const mainCategories = await categoryService.getShopCategory(shop_id);
        const listCategoryId = mainCategories.map((child) => child.id);
        const shopChildCategories = await categoryService.getAll('', '', '', {}, listCategoryId);
        const categories = [...shopChildCategories, ...mainCategories];

        const [recentProd, popularProd, specialProd] = await Promise.all([
            // recent products
            productService.getByCondition(category_id, '', 3),
            // popular products
            productService.getByCondition(category_id, 'popular', 3),
            // special products
            productService.getByCondition(category_id, 'special', 3),
        ]);

        fsHelper.writeFile('src/files/shopData.txt', {
            shop_id,
            categories,
            recentProd,
            popularProd,
            specialProd,
            updated_at: new Date(),
        });
        return { shop_id, categories, recentProd, popularProd, specialProd };
    }
    const fileData = fsHelper.readFile('src/files/shopData.txt', 'Async');
    if (fileData) {
        const jsonData = JSON.parse(fileData);
        if (new Date() - new Date(jsonData.updated_at) >= timeExpired) {
            const { id: shop_id } = await categoryService.getIdByName('Shop');
            const mainCategories = await categoryService.getShopCategory(shop_id);
            const listCategoryId = mainCategories.map((child) => child.id);
            const shopChildCategories = await categoryService.getAll('', '', '', {}, listCategoryId);
            const categories = [...shopChildCategories, ...mainCategories];

            const [recentProd, popularProd, specialProd] = await Promise.all([
                // recent products
                productService.getByCondition(category_id, '', 3),

                // popular products
                productService.getByCondition(category_id, 'popular', 3),

                // special products
                productService.getByCondition(category_id, 'special', 3),
            ]);

            fsHelper.writeFile('src/files/shopData.txt', {
                shop_id,
                categories,
                recentProd,
                popularProd,
                specialProd,

                updated_at: new Date(),
            });
            return { shop_id, categories, recentProd, popularProd, specialProd };
        } else {
            return {
                shop_id: jsonData.shop_id,
                categories: jsonData.categories,
                recentProd: jsonData.recentProd,
                popularProd: jsonData.popularProd,
                specialProd: jsonData.specialProd,
            };
        }
    } else {
        const { id: shop_id } = await categoryService.getIdByName('Shop');
        const mainCategories = await categoryService.getShopCategory(shop_id);
        const listCategoryId = mainCategories.map((child) => child.id);
        const shopChildCategories = await categoryService.getAll('', '', '', {}, listCategoryId);
        const categories = [...shopChildCategories, ...mainCategories];

        const [recentProd, popularProd, specialProd] = await Promise.all([
            // recent products
            productService.getByCondition(category_id, '', 3),

            // popular products
            productService.getByCondition(category_id, 'popular', 3),

            // special products
            productService.getByCondition(category_id, 'special', 3),
        ]);

        fsHelper.writeFile('src/files/shopData.txt', {
            shop_id,
            categories,
            recentProd,
            popularProd,
            specialProd,
            updated_at: new Date(),
        });
        return { shop_id, categories, recentProd, popularProd, specialProd };
    }
};

const fetchDataDetailFile = async ({ id, category_id, brand_id }) => {
    const timeExpired = 60 * 60 * 1000;
    if (!fsHelper.checkFileExist('src/files/shopDetailData.txt')) {
        const [relatedProd, brand, category] = await Promise.all([
            productService.getByCondition(category_id, '', 5, id),
            brandService.getOneById(brand_id),
            categoryService.getOneById(category_id),
        ]);

        fsHelper.writeFile('src/files/shopDetailData.txt', {
            relatedProd,
            brand,
            category,
            updated_at: new Date(),
        });
        return { relatedProd, brand, category };
    }
    const fileData = fsHelper.readFile('src/files/shopDetailData.txt', 'Async');
    if (fileData) {
        const jsonData = JSON.parse(fileData);
        if (new Date() - new Date(jsonData.updated_at) >= timeExpired) {
            const [relatedProd, brand, category] = await Promise.all([
                productService.getByCondition(category_id, '', 5, id),
                brandService.getOneById(brand_id),
                categoryService.getOneById(category_id),
            ]);

            fsHelper.writeFile('src/files/shopDetailData.txt', {
                relatedProd,
                brand,
                category,
                updated_at: new Date(),
            });
            return { relatedProd, brand, category };
        } else {
            return {
                relatedProd: jsonData.relatedProd,
                brand: jsonData.brand,
                category: jsonData.category,
            };
        }
    } else {
        const [relatedProd, brand, category] = await Promise.all([
            productService.getByCondition(category_id, '', 5, id),
            brandService.getOneById(brand_id),
            categoryService.getOneById(category_id),
        ]);

        fsHelper.writeFile('src/files/shopDetailData.txt', {
            relatedProd,
            brand,
            category,
            updated_at: new Date(),
        });
        return { relatedProd, brand, category };
    }
};

module.exports = { fetchDataFile, fetchDataDetailFile };
