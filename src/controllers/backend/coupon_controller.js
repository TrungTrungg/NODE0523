const { couponService: service } = require('@services');
const { notify, couponCollection: collection } = require('@utils');
const { handlePagination, catchAsync } = require('@helpers');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res) => {
    const { status } = req.params;
    const { search, page, category } = req.query;

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    let category_id = '';
    if (category) category_id = category;

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(keyword);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(keyword, pagination);
    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: collection,
        collection,
        items,
        pagination,
        keyword,
        messages,
        currentStatus: '',
    };
    res.render(`backend/pages/${collection}`, options);
});
// render add item page
const renderAddPage = catchAsync(async (req, res) => {
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };

    const couponConditions = [
        { value: 0, name: 'Từ 0Đ' },
        { value: 100000, name: 'Từ 100,000 VNĐ' },
        { value: 1000000, name: 'Từ 1,000,000 VNĐ' },
        { value: 10000000, name: 'Từ 10,000,000 VNĐ' },
        { value: 100000000, name: 'Từ 100,000,000 VNĐ' },
    ];

    const coupon = { couponConditions };
    const options = {
        page: 'Add',
        collection,
        coupon,
        messages,
    };

    res.render(`backend/pages/${collection}/${collection}_add`, options);
});

// create
const addOne = catchAsync(async (req, res) => {
    const { code, type, value, started_at, expired_at, quantity, condition } = req.body;
    await service.create(code, type, value, started_at, expired_at, quantity, condition);
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
    const couponn = await service.getOneById(id);
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const couponConditions = [
        { value: 0, name: 'Từ 0Đ' },
        { value: 100000, name: 'Từ 100,000 VNĐ' },
        { value: 1000000, name: 'Từ 1,000,000 VNĐ' },
        { value: 10000000, name: 'Từ 10,000,000 VNĐ' },
        { value: 100000000, name: 'Từ 100,000,000 VNĐ' },
    ];

    const coupon = { ...couponn._doc, couponConditions };
    const options = {
        page: 'Item',
        collection,
        coupon,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res) => {
    const { id, code, type, value, started_at, expired_at, quantity, condition } = req.body;

    // update
    await service.updateOneById(id, code, type, value, started_at, expired_at, quantity, condition);
    // message và chuyển hướng
    req.flash('success', notify.SUCCESS_EDIT);
    res.redirect(`/admin/${collection}`);
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
module.exports = {
    renderList,
    renderAddPage,
    addOne,
    deleteOne,
    renderEditPage,
    editOne,
    // changeStatus,
    changeOrderingAjax,
};
