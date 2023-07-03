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
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, category_id, brand_id, pagination);

    // get id shop category
    const [{ id: shop_id }] = await categoryService.getShopCategoriesID();

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
    const [{ id: shop_id }] = await categoryService.getShopCategoriesID();

    const categories = await getListCategories(shop_id);

    const brands = await getListBrands();
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Add',
        collection,
        shop_id,
        categories,
        brands,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_add`, options);
});

// add item
const addOne = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/add`);
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
            is_special,
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
            is_special,
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

    await service.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect(`/admin/${collection}`);
});

// render Edit item page
const renderEditPage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        status,
        ordering,
        is_special,
        price,
        quantity,
        sold,
        sale,
        description,
        specification,
        category_id,
        brand_id,
        image,
        gallery_image,
    } = await service.getOneById(id);
    const { size, ram, cpu, ssd, vga } = specification;
    const [{ id: shop_id }] = await categoryService.getShopCategoriesID();

    const categories = await getListCategories(shop_id);

    const brands = await getListBrands();
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Item',
        collection,
        id,
        name,
        status,
        ordering,
        is_special,
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
        categories,
        brands,
    };
    res.render(`backend/pages/${collection}/${collection}_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res) => {
    const { id } = req.body;
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/edit/${id}`);
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
        // Lấy data sau khi validate
        const {
            name,
            status,
            ordering,
            is_special,
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
        } = matchedData(req);
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
            is_special,
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

// Change status of item
// const changeStatus = catchAsync(async (req, res) => {
//     const { id, status } = req.param);
//     const { page, search } = req.query;

//     // handle query
//     let query = `?page=1`;
//     if (search) query += `&search=${search}`;

//     // handle change status
//     let newStatus = status;
//     if (newStatus === filterOptions.active.toLowerCase()) newStatus = filterOptions.inactive;
//     else newStatus = filterOptions.active;

//     await service.changeStatusById(id, newStatus.toLowerCase());
//     req.flash('success', notify.SUCCESS_CHANGE_STATUS);
//     res.redirect(`/admin/item${query}`);
// };

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

    await service.changeFieldById(id, 'is_special', is_special);

    res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, is_special });
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
    renderEditPage,
    editOne,
    // changeStatus,
    changeStatusAjax,
    changeUrlAjax,
    changeOrderingAjax,
    changeIsSpecialAjax,
    getListCategoriesAjax,
};
