const express = require('express');
const router = express.Router();

const itemService = require('../../services/item_service');
const statusUtils = require('../../utils/status');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', async (req, res, next) => {
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
    // console.log(pagination);
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
});

// Chuyển hướng trang tạo mới Item
router.get('/add', async (req, res, next) => {
    res.render('backend/pages/item/item_add');
});

// Thêm 1 Item
router.post('/', async (req, res, next) => {
    const { name, status, ordering } = req.body;
    const newItem = await itemService.create(name, status, ordering);
    res.redirect('/admin/item');
});

// Xóa 1 Item
router.get('/delete/:id', async (req, res, next) => {
    const { id } = req.params;
    await itemService.deleteOneById(id);
    res.redirect('/admin/item');
});

// Sửa 1 Item
router.post('/edit', async (req, res, next) => {
    const { id, name, status, ordering } = req.body;
    const itemUpdated = await itemService.updateOneById(id, name, status, ordering);
    res.redirect('/admin/item');
});

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, status, ordering } = await itemService.getOneById(id);
    options = { id, name, status, ordering };
    res.render('backend/pages/item/item_edit', options);
});

// Sửa status của 1 Item
router.get('(/:id/:status)?', async (req, res, next) => {
    const { id, status } = req.params;
    let newStatus = '';
    if (status === 'active') newStatus = 'inactive';
    else newStatus = 'active';
    await itemsService.changeStatusById(id, newStatus);
    res.redirect('/admin/item');
});

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, status, ordering } = await itemService.getOneById(id);
    options = { id, name, status, ordering };
    res.render('backend/pages/items/edit', options);
});

// Sửa status của 1 Item
router.get('(/:id/:status)?', async (req, res, next) => {
    const { id, status } = req.params;
    const { page, search } = req.query;

    // handle query
    let query = `?page=${page}`;
    if (search) query += `&search=${search}`;

    // handle change status
    let newStatus = '';
    if (status === 'active') newStatus = 'inactive';
    else newStatus = 'active';

    await itemService.changeStatusById(id, newStatus);
    res.redirect(`/admin/item${query}`);
});

module.exports = router;
