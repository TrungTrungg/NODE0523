const fs = require('fs');

const { productService: service } = require('@services');
const { handlePagination, getListBrands, catchAsync, shopHelper } = require('@helpers');
const { shopCollection: collection, productPrice } = require('@utils');

const renderShop = catchAsync(async (req, res) => {
    const { slugId } = req.params;
    const { page, search, brand_id, price, sort, sale } = req.query;
    let category_id = '';
    if (slugId) {
        const match = slugId.match(/([a-f0-9]+)$/i);
        category_id = match[1];
    }

    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    const totalItems = await service.countByCategory(category_id, keyword, brand_id, price, sale);
    const pagination = handlePagination(totalItems, currentPage, (itemsPerPage = 12), (pageRange = 5));

    const [products, brands] = await Promise.all([
        // get list product
        service.getAll('', keyword, category_id, brand_id, pagination, price, sort, sale),
        // brands
        getListBrands(),
    ]);

    const { shop_id, categories, recentProd, popularProd, specialProd } = await shopHelper.fetchDataFile(category_id);
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
        title: 'Trang mua sắm',
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
        totalItems,
    };
    res.render('frontend/pages/shop', options);
});

const renderProductDetail = catchAsync(async (req, res) => {
    const { slugId } = req.params;

    const match = slugId.match(/([a-f0-9]+)$/i);
    const id = match[1];

    const product = await service.getOneById(id);
    const { relatedProd, brand, category } = await shopHelper.fetchDataDetailFile(product);

    const options = {
        title: 'Trang chi tiết sản phẩm',
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
