const { matchedData } = require('express-validator');
const fs = require('fs');
const unidecode = require('unidecode');

const { deliveryService: service } = require('@services');
const { filterOptions, notify, deliveryCollection: collection } = require('@utils');
const { handlePagination, getListCategories, catchAsync } = require('@helpers');
const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res) => {
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
        { name: filterOptions.all, qty: await service.countByStatus('', keyword) },
        { name: filterOptions.active, qty: await service.countByStatus(filterOptions.active, keyword) },
        {
            name: filterOptions.inactive,
            qty: await service.countByStatus(filterOptions.inactive, keyword),
        },
    ];

    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, pagination);

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
        messages,
    };
    res.render(`backend/pages/${collection}`, options);
});

// render add item page
const renderAddPage = catchAsync(async (req, res) => {
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Add',
        collection,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_add`, options);
});

// add item
const addOne = catchAsync(async (req, res) => {
    const { location, status, shipping_fee } = req.body;
    await service.create(location, status, shipping_fee);
    req.flash('success', notify.SUCCESS_ADD);
    res.redirect(`/admin/${collection}`);
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
    const deliveryy = await service.getOneById(id);
    const locations = await service.getLocations();
    const delivery = { ...deliveryy._doc, locations };
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Item',
        collection,
        delivery,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res) => {
    const { id, status, shipping_fee } = req.body;

    const { location } = await service.getOneById(id);
    // update
    await service.updateOneById(id, location, status, shipping_fee);
    // message và chuyển hướng
    req.flash('success', notify.SUCCESS_EDIT);
    res.redirect(`/admin/${collection}`);
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

module.exports = {
    renderList,
    renderAddPage,
    addOne,
    deleteOne,
    renderEditPage,
    editOne,
    // changeStatus,
    changeStatusAjax,
};
