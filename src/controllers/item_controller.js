const itemService = require('@services/item_service');
const statusUtils = require('@utils/status');
const pageHelper = require('@helpers/pagination_helper');

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

    const options = {
        items,
        filter,
        currentStatus,
        pagination,
        keyword,
    };

    res.render('backend/pages/item', options);
};

// render add item page
const renderAddPage = (req, res, next) => {
    res.render('backend/pages/item/item_add');
};

// add item
const addOne = async (req, res, next) => {
    const { name, status, ordering } = req.body;
    await itemService.create(name, status, ordering);
    res.redirect('/admin/item');
};

// delete one item
const deleteOne = async (req, res, next) => {
    const { id } = req.params;
    await itemService.deleteOneById(id);
    res.redirect('/admin/item');
};

// render Edit item page
const renderEditPage = async (req, res, next) => {
    const { id } = req.params;
    const { name, status, ordering } = await itemService.getOneById(id);
    options = { id, name, status, ordering };
    res.render('backend/pages/items/edit', options);
};

// Edit item
const editOne = async (req, res, next) => {
    const { id, name, status, ordering } = req.body;
    const itemUpdated = await itemService.updateOneById(id, name, status, ordering);
    res.redirect('/admin/item');
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

    console.log(newStatus.toLowerCase());

    await itemService.changeStatusById(id, newStatus.toLowerCase());
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
