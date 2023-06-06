const express = require('express');
const router = express.Router();

const itemsService = require('../../services/items_service');
const statusUtils = require('../../utils/status');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', async (req, res, next) => {
    const { status } = req.params;
    const { search } = req.query;

    // Xử lý status
    let currentStatus = status;
    if (currentStatus !== undefined) {
        currentStatus = status === statusUtils.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // Tạo dữ liệu cho filter
    const filter = [
        { name: statusUtils.all, qty: await itemsService.countByStatus() },
        { name: statusUtils.acitve, qty: await itemsService.countByStatus(statusUtils.active) },
        { name: statusUtils.inactive, qty: await itemsService.countByStatus(statusUtils.inactive) },
    ];

    // Lấy danh sách item
    const items = await itemsService.getAll(currentStatus, keyword);

    const options = {
        items,
        filter,
        currentStatus,
        keyword,
    };

    res.render('backend/pages/items', options);
});

// Chuyển hướng trang tạo mới Item
router.get('/add', async (req, res, next) => {
    res.render('backend/pages/items/add');
});

// Thêm 1 Item
router.post('/', async (req, res, next) => {
    const { name, status, ordering } = req.body;
    const newItem = await itemsService.create(name, status, ordering);
    res.redirect('/admin/item');
});

// Xóa 1 Item
router.get('/delete/:id', async (req, res, next) => {
    const { id } = req.params;
    await itemsService.deleteOneById(id);
    res.redirect('/admin/item');
});

// Sửa 1 Item
router.post('/edit', async (req, res, next) => {
    const { id, name, status, ordering } = req.body;
    const itemUpdated = await itemsService.updateOneById(id, name, status, ordering);
    res.redirect('/admin/item');
});

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, status, ordering } = await itemsService.getOneById(id);
    options = { id, name, status, ordering };
    res.render('backend/pages/items/edit', options);
});

// Sửa status của 1 Item
router.get('(/:id/:status)?', async (req, res, next) => {
    const { id, status } = req.params;
    const { search } = req.query;

    // handle search query
    let query = '';
    if (search) query = `?search=${search}`;

    // handle change status
    let newStatus = '';
    if (status === 'active') newStatus = 'inactive';
    else newStatus = 'active';

    await itemsService.changeStatusById(id, newStatus);
    res.redirect(`/admin/item${query}`);
});

module.exports = router;
