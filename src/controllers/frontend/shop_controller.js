const { productService: service, categoryService, brandService, settingService } = require('@services');
const { handlePagination, getListCategories, getListBrands, catchAsync } = require('@helpers');
const { shopCollection: collection, productPrice } = require('@utils');

const renderShop = catchAsync(async (req, res) => {
    const { category_id } = req.params;
    const { page, search, brand_id, price, sort, sale } = req.query;

    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    const totalItems = await service.countByCategory(category_id, keyword, brand_id, price, sale);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 9), (pageRange = 5));

    // // get list product
    // const products = await service.getAll('', keyword, category_id, brand_id, pagination, price, sort, sale);

    // // recent products
    // const recentProd = await service.getByCondition(category_id, '', 3);

    // // popular products
    // const popularProd = await service.getByCondition(category_id, 'popular', 3);

    // // special products
    // const specialProd = await service.getByCondition(category_id, 'special', 3);
    const [products, recentProd, popularProd, specialProd] = await Promise.all([
        // get list product
        service.getAll('', keyword, category_id, brand_id, pagination, price, sort, sale),

        // recent products
        service.getByCondition(category_id, '', 3),

        // popular products
        service.getByCondition(category_id, 'popular', 3),

        // special products
        service.getByCondition(category_id, 'special', 3),
    ]);
    // get shop categories
    const { id: shop_id } = await categoryService.getShopCategoriesID();
    const mainCategories = await categoryService.getShopCategory(shop_id);
    const listCategoryId = mainCategories.map((child) => child.id);
    const shopChildCategories = await categoryService.getAll('', '', '', {}, listCategoryId);
    const categories = [...shopChildCategories, ...mainCategories];
    // get brands
    const brands = await getListBrands();

    // create price filter
    const priceFilter = [
        { name: productPrice.price1.name, value: productPrice.price1.value },
        { name: productPrice.price2.name, value: productPrice.price2.value },
        { name: productPrice.price3.name, value: productPrice.price3.value },
        { name: productPrice.price4.name, value: productPrice.price4.value },
    ];

    const nameFilter = [
        { name: 'Từ A đến Z', value: 'asc' },
        { name: 'Từ Z về A', value: 'desc' },
    ];
    const saleFilter = [
        { name: 'Dưới 50%', value: 'lower,50' },
        { name: 'Từ 50% trở lên', value: 'higher,50' },
    ];
    const options = {
        page: 'Trang mua sắm',
        pageDesc: 'Chọn lựa những sản phẩm yêu thích',
        collection,
        keyword,
        currentPage,
        category_id,
        brand_id,
        products,
        recentProd,
        popularProd,
        specialProd,
        shop_id,
        categories,
        brands,
        priceFilter,
        nameFilter,
        saleFilter,
        pagination,
        price,
        sort,
        sale,
    };
    res.render('frontend/pages/shop', options);
});

const renderProductDetail = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await service.getOneById(id);
    // const relatedProd = await service.getByCondition(product.category_id, '', 5, id);
    // const { purchase: purchaseSetting } = await settingService.getSetting();
    // const brand = await brandService.getOneById(product.brand_id);
    // const category = await categoryService.getOneById(product.category_id);
    const [relatedProd, brand, category] = await Promise.all([
        service.getByCondition(product.category_id, '', 5, id),
        brandService.getOneById(product.brand_id),
        categoryService.getOneById(product.category_id),
    ]);
    const options = {
        page: product.name,
        pageDesc: '',
        collection,
        product,
        relatedProd,
        brand,
        category,
    };
    res.render('frontend/pages/shop/detail', options);
});

module.exports = {
    renderShop,
    renderProductDetail,
};
