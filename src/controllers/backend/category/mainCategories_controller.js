const { matchedData } = require('express-validator');
const unidecode = require('unidecode');

const { categoryService: service } = require('@services');
const { filterOptions, notify, mainCategoriesCollection: collection } = require('@utils');
const { handlePagination, catchAsync } = require('@helpers');
const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res, next) => {
    // Lấy dữ liệu từ url: params, query
    const { status } = req.params;
    const { search, page } = req.query;

    // Xử lý status
    let currentStatus = '';
    if (status) {
        currentStatus = status === filterOptions.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // shop id
    const { id: shop_id } = await service.getIdByName('Shop');

    // Tạo dữ liệu cho filter
    const filter = [
        { name: filterOptions.all, qty: await service.countByStatus('', keyword, 'main', shop_id) },
        {
            name: filterOptions.active,
            qty: await service.countByStatus(filterOptions.active, keyword, 'main', shop_id),
        },
        {
            name: filterOptions.inactive,
            qty: await service.countByStatus(filterOptions.inactive, keyword, 'main', shop_id),
        },
    ];

    // So sánh với param để active trang thái filter
    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword, 'main', shop_id);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getMainCategories(currentStatus, keyword, pagination, shop_id);

    // Message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };

    // Options
    const options = {
        page: collection,
        collection,
        items,
        filter,
        statusFilterOptions,
        currentStatus,
        pagination,
        keyword,
        messages,
    };
    res.render(`backend/pages/category`, options);
});

// render add item page
const renderAddPage = catchAsync(async (req, res, next) => {
    // Message - use connect-flash
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    console.log(req.flash('error'));
    // Options
    const options = {
        page: 'Add',
        collection,
        messages,
    };
    res.render(`backend/pages/category/category_add`, options);
});

// add item
const addOne = catchAsync(async (req, res, next) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);

        res.redirect(`/admin/${collection}/add`);
    } else {
        const { name, url, status, ordering } = matchedData(req);
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        await service.create(name, slug, status.toLowerCase(), ordering, url);
        req.flash('success', notify.SUCCESS_ADD);
        res.redirect(`/admin/${collection}`);
    }
});

// delete one item
const deleteOne = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await service.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect(`/admin/${collection}`);
});

// render Edit item page
const renderEditPage = catchAsync(async (req, res, next) => {
    // Lấy items cần sửa đổi
    const { id } = req.params;
    const mainCategory = await service.getOneById(id);

    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };

    const options = { page: 'Edit', collection, messages, mainCategory };
    res.render(`backend/pages/category/category_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/edit/${id}`);
    } else {
        const { name, status, ordering, url } = matchedData(req);
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        await service.updateOneById(id, name, slug, status.toLowerCase(), ordering, url);
        req.flash('success', notify.SUCCESS_EDIT);
        res.redirect(`/admin/${collection}`);
    }
});

// Change status of item

const changeStatusAjax = catchAsync(async (req, res, next) => {
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

const changeOrderingAjax = catchAsync(async (req, res, next) => {
    const { id, ordering } = req.params;
    if (isNaN(ordering)) {
        res.send({ error: true, message: notify.ERROR_ORDERING_VALUE });
    } else if (parseInt(ordering) <= 0) {
        res.send({ error: true, message: notify.ERROR_ORDERING_VALUE });
    } else {
        // handle change status
        await service.changeFieldById(id, 'ordering', ordering);
        res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, ordering });
    }
});

const changeIsSpecialAjax = catchAsync(async (req, res, next) => {
    const { id, is_special } = req.params;

    await service.changeFieldById(id, 'isMenu', is_special);

    res.send({ success: true, message: notify.SUCCESS_CHANGE_ISMENU, is_special });
});

const changeUrlAjax = catchAsync(async (req, res, next) => {
    const { id, url } = req.params;

    // handle change status

    await service.changeFieldById(id, 'url', url);
    res.send({ success: true, message: notify.SUCCESS_CHANGE_URL, url });
});
module.exports = {
    renderList,
    renderAddPage,
    addOne,
    deleteOne,
    renderEditPage,
    editOne,
    changeStatusAjax,
    changeOrderingAjax,
    changeIsSpecialAjax,
    changeUrlAjax,
};
