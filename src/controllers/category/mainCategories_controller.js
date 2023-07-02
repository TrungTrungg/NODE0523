const { matchedData } = require('express-validator');
const unidecode = require('unidecode');

const { categoryService: service } = require('@services');
const { filterOptions, notify, mainCategoriesCollection: collection } = require('@utils');
const { handlePagination, getListCategories, catchAsync } = require('@helpers');
const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res, next) => {
    // Lấy dữ liệu từ url: params, query
    const { status } = req.params;
    const { search, page, category } = req.query;

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

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: filterOptions.all, qty: await service.countByStatus('', keyword, category_id) },
        { name: filterOptions.active, qty: await service.countByStatus(filterOptions.active, keyword, category_id) },
        {
            name: filterOptions.inactive,
            qty: await service.countByStatus(filterOptions.inactive, keyword, category_id),
        },
    ];

    // So sánh với param để active trang thái filter
    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword, category_id);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, category_id, pagination);

    // Lấy danh sách danh mục
    const categories = await getListCategories();
    // Hiển thị danh mục đang dược lọc
    let cateName = '';
    if (category_id) {
        let category = await service.getCategory(category_id);
        const { name } = category;
        cateName = name;
    }

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
        categories,
        cateName,
        messages,
    };
    res.render(`backend/pages/category`, options);
});

// render add item page
const renderAddPage = catchAsync(async (req, res, next) => {
    // Get list categories
    const categories = await getListCategories();

    // Message - use connect-flash
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };

    // Options
    const options = {
        page: 'Add',
        collection,
        messages,
        categories,
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
        const { name, status, ordering, url } = matchedData(req);
        const { category_id } = req.body;
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        await service.create(name, status.toLowerCase(), ordering, slug, url, category_id);
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
    const { name, status, ordering, url, category_id } = await service.getOneById(id);

    // categories
    const categories = await getListCategories();

    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };

    const options = { page: 'Edit', collection, id, name, status, ordering, url, category_id, categories, messages };
    res.render(`backend/pages/category/category_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res, next) => {
    const { id, category_id } = req.body;
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
        await service.updateOneById(id, name, status.toLowerCase(), ordering, slug, url, category_id);
        req.flash('success', notify.SUCCESS_EDIT);
        res.redirect(`/admin/${collection}`);
    }
});

// Change status of item
const changeStatus = catchAsync(async (req, res, next) => {
    const { id, status } = req.params;
    const { page, search } = req.query;

    // handle query
    let query = `?page=1`;
    if (search) query += `&search=${search}`;

    // handle change status
    let newStatus = status;
    if (newStatus === filterOptions.active.toLowerCase()) newStatus = filterOptions.inactive;
    else newStatus = filterOptions.active;

    await service.changeStatusById(id, newStatus.toLowerCase());
    req.flash('success', notify.SUCCESS_CHANGE_STATUS);
    res.redirect(`/admin/${collection}${query}`);
});

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
    } else {
        // handle change status
        await service.changeFieldById(id, 'ordering', ordering);
        res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, ordering });
    }
});

const changeIsSpecialAjax = catchAsync(async (req, res, next) => {
    const { id, is_special } = req.params;

    await service.changeFieldById(id, 'isMenu', is_special);

    res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, is_special });
});

const changeUrlAjax = catchAsync(async (req, res, next) => {
    const { id, url } = req.params;

    // handle change status

    await service.changeFieldById(id, 'url', url);
    res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, url });
});
module.exports = {
    renderList,
    renderAddPage,
    addOne,
    deleteOne,
    renderEditPage,
    editOne,
    changeStatus,
    changeStatusAjax,
    changeOrderingAjax,
    changeIsSpecialAjax,
    changeUrlAjax,
};
