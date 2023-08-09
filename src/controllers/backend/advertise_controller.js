const { matchedData } = require('express-validator');
const fs = require('fs');
const unidecode = require('unidecode');

const { advertiseService: service } = require('@services');
const { filterOptions, notify, advertiseCollection: collection } = require('@utils');
const { handlepagination, catchAsync } = require('@helpers');
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

    // pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword);
    const pagination = handlepagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, pagination);

    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        title: 'Trang quảng cáo',
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
        title: 'Trang thêm quảng cáo',
        page: 'Add',
        collection,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_add`, options);
});

// add item
const addOne = catchAsync(async (req, res) => {
    // const errors = resultsValidator(req);
    // if (errors.length > 0) {
    //     req.flash('error', errors);
    //     res.redirect(`/admin/${collection}/add`);
    // } else {
    const { name, image, url, position, status, started_at, expired_at } = req.body;
    console.log(name, image, url, position, status, started_at, expired_at);
    let imageName = '';
    if (req.file) imageName = req.file.filename;

    await service.create(name, image, url, position, status.toLowerCase(), started_at, expired_at);
    req.flash('success', notify.SUCCESS_ADD);
    res.redirect(`/admin/${collection}`);
    // }
});

// delete one item
const deleteOne = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { image } = await service.getOneById(id);
    const imagePath = `public/uploads/advertise/${image}`;
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    await service.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect(`/admin/${collection}`);
});

// render Edit item page
const renderEditPage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const advertise = await service.getOneById(id);
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        title: 'Trang sửa quảng cáo',
        page: 'Item',
        collection,
        advertise,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res) => {
    const { id, name, image, url, position, status, started_at, expired_at } = req.body;
    // const errors = resultsValidator(req);
    // if (errors.length > 0) {
    //     req.flash('error', errors);
    //     res.redirect(`/admin/${collection}/edit/${id}`);
    // } else {
    let imageName = '';
    if (req.file) {
        imageName = req.file.filename;
        const { image } = await service.getOneById(id);
        if (image) {
            const imagePath = `public/uploads/advertise/${image}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
    }
    // update
    await service.updateOneById(id, name, imageName, url, position, status.toLowerCase(), started_at, expired_at);
    // message và chuyển hướng
    req.flash('success', notify.SUCCESS_EDIT);
    res.redirect(`/admin/${collection}`);
    // }
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

    await service.changeFieldById(id, 'is_special', is_special);

    res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, is_special });
};

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
};
