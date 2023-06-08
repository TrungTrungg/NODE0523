const itemService = require('@services/item_service');
const statusUtils = require('@utils/status_util');
const pageHelper = require('@helpers/pagination_helper');
const notifyUtil = require('@utils/notify_util');
const { resultsValidator } = require('@validators/item_validator');
const { matchedData } = require('express-validator');

// render list items, filter status, pagination
const renderListItems = async (req, res, next) => {
    const { status } = req.params;
    const { search, page } = req.query;

    // Xử lý status
    let currentStatus = status;
    if (currentStatus !== undefined) {
        currentStatus = status === statusUtils.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: statusUtils.all, qty: await itemService.countByStatus() },
        { name: statusUtils.active, qty: await itemService.countByStatus(statusUtils.active) },
        { name: statusUtils.inactive, qty: await itemService.countByStatus(statusUtils.inactive) },
    ];

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const pagination = await pageHelper.handlePagination(
        keyword,
        currentStatus,
        currentPage,
        (itemsPerPage = 3),
        (pageRange = 3),
    );
    // Lấy danh sách item
    const items = await itemService.getAll(currentStatus, keyword, pagination);

    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        items,
        filter,
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
        req.flash('success', notifyUtil.SUCCESS_ADD);
        res.redirect('/admin/item');
    }
};

// delete one item
const deleteOne = async (req, res, next) => {
    const { id } = req.params;
    await itemService.deleteOneById(id);
    req.flash('success', notifyUtil.SUCCESS_DELETE);
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
        req.flash('success', notifyUtil.SUCCESS_EDIT);
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
    if (newStatus === statusUtils.active.toLowerCase()) newStatus = statusUtils.inactive;
    else newStatus = statusUtils.active;

    await itemService.changeStatusById(id, newStatus.toLowerCase());
    req.flash('success', notifyUtil.SUCCESS_CHANGE_STATUS);
    res.redirect(`/admin/item${query}`);
};

module.exports = {
    renderListItems,
    renderAddPage,
    addOne,
    deleteOne,
    renderEditPage,
    editOne,
    changeStatus,
};
