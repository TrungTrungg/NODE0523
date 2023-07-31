const { matchedData } = require('express-validator');
const fs = require('fs');
const unidecode = require('unidecode');

const { productService: service, categoryService, brandService } = require('@services');
const { filterOptions, notify, productCollection: collection } = require('@utils');
const { handlePagination, getListCategories, getListBrands, catchAsync } = require('@helpers');

const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res) => {
    const { status } = req.params;
    const { search, page, category, brand } = req.query;

    // Xử lý status
    let currentStatus = status;
    if (currentStatus !== undefined) {
        currentStatus = status === filterOptions.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    let category_id = '';
    if (category) category_id = category;

    let brand_id = '';
    if (brand) brand_id = brand;

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: filterOptions.all, qty: await service.countByStatus('', keyword, category_id, brand_id) },
        {
            name: filterOptions.active,
            qty: await service.countByStatus(filterOptions.active, keyword, category_id, brand_id),
        },
        {
            name: filterOptions.inactive,
            qty: await service.countByStatus(filterOptions.inactive, keyword, category_id, brand_id),
        },
    ];

    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword, category_id, brand_id);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 15), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, category_id, brand_id, pagination);

    // get id shop category
    const { id: shop_id } = await categoryService.getIdByName('Shop');

    const categories = await categoryService.getSubCategory();

    const brands = await getListBrands();
    // categories

    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: collection,
        collection,
        items,
        filter,
        statusFilterOptions,
        currentStatus,
        pagination,
        keyword,
        shop_id,
        categories,
        brands,
        messages,
    };
    res.render(`backend/pages/${collection}`, options);
});

// render add item page
const renderAddPage = catchAsync(async (req, res) => {
    const { id: shop_id } = await categoryService.getIdByName('Shop');

    const categories = await getListCategories(shop_id);

    const brands = await getListBrands();
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const product = {
        categories,
        brands,
        shop_id,
    };
    const options = {
        page: 'Add',
        collection,
        product,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_add`, options);
});

// add item
const addOne = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/${collection}_add`);
    } else {
        let image = '';
        let gallery_image = [];

        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname === 'image') {
                    image = req.files[i].filename;
                }
                if (req.files[i].fieldname === 'gallery_image') {
                    gallery_image.push(req.files[i].filename);
                }
            }
        }
        // const { name, status, ordering, category_id, author, description, url, is_special } = matchedData(req);
        const {
            name,
            status,
            ordering,
            special,
            showHome,
            price,
            quantity,
            sold,
            sale,
            description,
            size,
            ram,
            cpu,
            ssd,
            vga,
            category_id,
            brand_id,
        } = req.body;
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();

        await service.create(
            name,
            slug,
            status.toLowerCase(),
            ordering,
            special,
            showHome,
            price,
            quantity,
            sold,
            sale,
            description,
            size,
            ram,
            cpu,
            ssd,
            vga,
            category_id,
            brand_id,
            image,
            gallery_image,
        );
        req.flash('success', notify.SUCCESS_ADD);
        res.redirect(`/admin/${collection}`);
    }
});

// delete one item
const deleteOne = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await service.getOneById(id);
    imagePath = `public/uploads/product/${product.image}`;
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    product.gallery_image.map((gallery) => {
        imagePath = `public/uploads/product/${gallery}`;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    });
    await service.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect(`/admin/${collection}`);
});

const deleteMulti = catchAsync(async (req, res) => {
    console.log(req.body);
    // const { id } = req.params;
    // const product = await service.getOneById(id);
    // imagePath = `public/uploads/product/${product.image}`;
    // if (fs.existsSync(imagePath)) {
    //     fs.unlinkSync(imagePath);
    // }
    // product.gallery_image.map((gallery) => {
    //     imagePath = `public/uploads/product/${gallery}`;
    //     if (fs.existsSync(imagePath)) {
    //         fs.unlinkSync(imagePath);
    //     }
    // });
    // await service.deleteOneById(id);
    // req.flash('success', notify.SUCCESS_DELETE);
    // res.redirect(`/admin/${collection}`);
});

// render Edit item page
const renderEditPage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const productt = await service.getOneById(id);
    const { id: shop_id } = await categoryService.getIdByName('Shop');
    const categories = await getListCategories(shop_id);

    const brands = await getListBrands();
    const product = { ...productt._doc, categories, brands };
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Item',
        collection,
        product,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res) => {
    const {
        id,
        special,
        showHome,
        category_id,
        name,
        status,
        ordering,
        price,
        quantity,
        sold,
        sale,
        description,
        size,
        ram,
        cpu,
        ssd,
        vga,
        brand_id,
    } = req.body;
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/edit/${id}`);
    } else {
        let image = '';
        let gallery_image = [];
        const product = await service.getOneById(id);
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname === 'image') {
                    image = req.files[i].filename;
                    imagePath = `public/uploads/product/${product.image}`;
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
                if (req.files[i].fieldname === 'gallery_image') {
                    gallery_image.push(req.files[i].filename);
                    product.gallery_image.map((gallery) => {
                        imagePath = `public/uploads/product/${gallery}`;
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    });
                }
            }
        }

        // slug
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        // update
        await service.updateOneById(
            id,
            name,
            slug,
            status.toLowerCase(),
            ordering,
            special,
            showHome,
            price,
            quantity,
            sold,
            sale,
            description,
            size,
            ram,
            cpu,
            ssd,
            vga,
            category_id,
            brand_id,
            image,
            gallery_image,
        );
        // message và chuyển hướng
        req.flash('success', notify.SUCCESS_EDIT);
        res.redirect(`/admin/${collection}`);
    }
});
const changeStatusAjax = catchAsync(async (req, res) => {
    const { id, status } = req.params;
    const { search } = req.query;
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();
    // handle change status
    let newStatus = status;
    if (newStatus === filterOptions.active.toLowerCase()) newStatus = filterOptions.inactive;
    else newStatus = filterOptions.active;

    await service.changeFieldById(id, 'status', newStatus.toLowerCase());
    const allStatus = {
        name: filterOptions.all,
        count: await service.countByStatus('', keyword),
    };

    const activeStatus = {
        name: filterOptions.active,
        count: await service.countByStatus(filterOptions.active, keyword),
    };

    const inactiveStatus = {
        name: filterOptions.inactive,
        count: await service.countByStatus(filterOptions.inactive, keyword),
    };
    res.send({
        success: true,
        message: notify.SUCCESS_CHANGE_STATUS,
        status: newStatus.toLowerCase(),
        filter: { allStatus, activeStatus, inactiveStatus },
    });
});

const changeOrderingAjax = catchAsync(async (req, res) => {
    const { id, ordering } = req.params;
    if (isNaN(ordering)) {
        res.send({ error: true, message: notify.ERROR_ORDERING_VALUE });
    } else {
        // handle change status
        await service.changeFieldById(id, 'ordering', ordering);
        res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, ordering });
    }
});
const changeUrlAjax = async (req, res, next) => {
    const { id, url } = req.params;

    await service.changeFieldById(id, 'url', url);

    res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, url });
};

const changeIsSpecialAjax = async (req, res, next) => {
    const { id, is_special } = req.params;

    await service.changeFieldById(id, 'special', is_special);

    res.send({ success: true, message: notify.SUCCESS_CHANGE_SPECIAL, is_special });
};
const changeIsShowhomeAjax = async (req, res, next) => {
    const { id, is_showhome } = req.params;

    await service.changeFieldById(id, 'showHome', is_showhome);

    res.send({ success: true, message: notify.SUCCESS_CHANGE_SHOW, is_showhome });
};
const getListCategoriesAjax = catchAsync(async (req, res) => {
    const { category_id } = req.params;
    const categories = await getListCategories(category_id);
    res.send({ success: true, categories });
});

module.exports = {
    renderList,
    renderAddPage,
    addOne,
    deleteOne,
    deleteMulti,
    renderEditPage,
    editOne,
    // changeStatus,
    changeStatusAjax,
    changeUrlAjax,
    changeOrderingAjax,
    changeIsSpecialAjax,
    getListCategoriesAjax,
    changeIsShowhomeAjax,
};
