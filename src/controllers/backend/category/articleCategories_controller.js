const { matchedData } = require('express-validator');
const unidecode = require('unidecode');

const { categoryService: service } = require('@services');
const { filterOptions, notify, articleCategoriesCollection: collection } = require('@utils');
const { handlepagination, catchAsync } = require('@helpers');
const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res, next) => {
    // Lấy dữ liệu từ url: params, query
    const { status } = req.params;
    const { search, page } = req.query;

    // Xử lý status
    let currentStatus = status;
    if (status) {
        currentStatus = status === filterOptions.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // get article's categories ID
    const { id: article_id } = await service.getIdByName('Tin tức');

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: filterOptions.all, qty: await service.countByStatus('', keyword, 'article', article_id) },
        {
            name: filterOptions.active,
            qty: await service.countByStatus(filterOptions.active, keyword, 'article', article_id),
        },
        {
            name: filterOptions.inactive,
            qty: await service.countByStatus(filterOptions.inactive, keyword, 'article', article_id),
        },
    ];

    // So sánh với param để active trang thái filter
    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword, 'article', article_id);
    const pagination = await handlepagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, article_id, pagination);

    // Message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };

    // Options
    const options = {
        title: 'Trang danh mục bài viết',

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
    res.render(`backend/pages/articleCategories`, options);
});

// render add item page
const renderAddPage = catchAsync(async (req, res, next) => {
    // Message - use connect-flash
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    // Options
    const options = {
        title: 'Trang thêm danh mục bài viết',

        page: 'Add',
        collection,
        messages,
    };
    res.render(`backend/pages/articleCategories/articleCategories_add`, options);
});

// add item
const addOne = catchAsync(async (req, res, next) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/add`);
    } else {
        const { id: article_id } = await service.getIdByName('Tin tức');
        const { name, status, ordering, url } = matchedData(req);
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        await service.create(name, slug, status.toLowerCase(), ordering, url, article_id);
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
    const articleCategory = await service.getOneById(id);
    const { name, status, ordering, url } = articleCategory;

    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };

    const options = {
        title: 'Trang sửa danh mục bài viết',

        page: 'Edit',
        collection,
        id,
        name,
        status,
        ordering,
        url,
        messages,
        articleCategory,
    };
    res.render(`backend/pages/articleCategories/articleCategories_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/edit/${id}`);
    } else {
        const { id: article_id } = await service.getIdByName('Tin tức');
        const { name, status, ordering, url } = matchedData(req);
        const slug = unidecode(name)
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        await service.updateOneById(id, name, slug, status.toLowerCase(), ordering, url, article_id);
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
    changeUrlAjax,
};
