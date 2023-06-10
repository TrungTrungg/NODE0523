const { matchedData } = require('express-validator');

const { itemService } = require('@services');
const { filterOptions, notify } = require('@utils');
const { handlePagination } = require('@helpers');
const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderListItems = async (req, res, next) => {
    const { status } = req.params;
    const { search, page } = req.query;

    // Xử lý status
    let currentStatus = status;
    if (currentStatus !== undefined) {
        currentStatus = status === filterOptions.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: filterOptions.all, qty: await itemService.countByStatus('', keyword) },
        { name: filterOptions.active, qty: await itemService.countByStatus(filterOptions.active, keyword) },
        { name: filterOptions.inactive, qty: await itemService.countByStatus(filterOptions.inactive, keyword) },
    ];

    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const pagination = await handlePagination(keyword, currentStatus, currentPage, (itemsPerPage = 3), (pageRange = 3));
    // Lấy danh sách item
    const items = await itemService.getAll(currentStatus, keyword, pagination);

    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        items,
        filter,
        statusFilterOptions,
        currentStatus,
        pagination,
        keyword,
        messages,
    };

    res.render('backend/pages/item', options);
};

// render add item page
const renderAddPage = (req, res, next) => {
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    res.render('backend/pages/item/item_add', { messages });
};

// add item
const addOne = async (req, res, next) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect('/admin/item/add');
    } else {
        const { name, status, ordering } = matchedData(req);
        await itemService.create(name, status.toLowerCase(), ordering);
        req.flash('success', notify.SUCCESS_ADD);
        res.redirect('/admin/item');
    }
};

// delete one item
const deleteOne = async (req, res, next) => {
    const { id } = req.params;
    await itemService.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect('/admin/item');
};

// render Edit item page
const renderEditPage = async (req, res, next) => {
    const { id } = req.params;
    const { name, status, ordering } = await itemService.getOneById(id);

    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = { id, name, status, ordering, messages };
    res.render('backend/pages/item/item_edit', options);
};

// Edit item
const editOne = async (req, res, next) => {
    const { id } = req.body;
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/item/edit/${id}`);
    } else {
        const { name, status, ordering } = matchedData(req);
        await itemService.updateOneById(id, name, status.toLowerCase(), ordering);
        req.flash('success', notify.SUCCESS_EDIT);
        res.redirect('/admin/item');
    }
};

// Change status of item
const changeStatus = async (req, res, next) => {
    const { id, status } = req.params;
    const { page, search } = req.query;

    // handle query
    let query = `?page=1`;
    if (search) query += `&search=${search}`;

    // handle change status
    let newStatus = status;
    if (newStatus === filterOptions.active.toLowerCase()) newStatus = filterOptions.inactive;
    else newStatus = filterOptions.active;

    await itemService.changeStatusById(id, newStatus.toLowerCase());
    req.flash('success', notify.SUCCESS_CHANGE_STATUS);
    res.redirect(`/admin/item${query}`);
};

const changeStatusAjax = async (req, res, next) => {
    const { id, status } = req.params;
    const { search } = req.query;
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();
    // handle change status
    let newStatus = status;
    if (newStatus === filterOptions.active.toLowerCase()) newStatus = filterOptions.inactive;
    else newStatus = filterOptions.active;

    await itemService.changeStatusById(id, newStatus.toLowerCase());
    const allStatus = {
        name: filterOptions.all,
        count: await itemService.countByStatus('', keyword),
    };

    const activeStatus = {
        name: filterOptions.active,
        count: await itemService.countByStatus(filterOptions.active, keyword),
    };

    const inactiveStatus = {
        name: filterOptions.inactive,
        count: await itemService.countByStatus(filterOptions.inactive, keyword),
    };
    res.send({
        success: true,
        message: notify.SUCCESS_CHANGE_STATUS,
        status: newStatus.toLowerCase(),
        filter: { allStatus, activeStatus, inactiveStatus },
    });
};

const changeOrderingAjax = async (req, res, next) => {
    const { id, ordering } = req.params;
    if (isNaN(ordering)) {
        res.send({ error: true, message: notify.ERROR_ORDERING_VALUE });
    } else {
        // handle change status
        let newOrdering = parseInt(ordering);

        await itemService.changeOrderingById(id, newOrdering);
        res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, ordering: newOrdering });
    }
};

module.exports = {
    renderListItems,
    renderAddPage,
    addOne,
    deleteOne,
    renderEditPage,
    editOne,
    changeStatus,
    changeStatusAjax,
    changeOrderingAjax,
};
