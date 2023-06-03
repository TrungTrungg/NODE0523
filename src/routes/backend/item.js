const express = require('express');
const router = express.Router();

const itemsService = require('../../services/items_service');
const pageHelper = require('../../helpers/pagination_helper');

// Đỗ dữ liệu trang Item
router.get('(/status/:status)?', async (req, res, next) => {
    const { status } = req.params;
    const { search, page } = req.query;

    // Xử lý status
    let currentStatus = status === 'all' || !status ? '' : status;

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: 'all', qty: await itemsService.countByStatus() },
        { name: 'active', qty: await itemsService.countByStatus('active') },
        { name: 'inactive', qty: await itemsService.countByStatus('inactive') },
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
    const items = await itemsService.getAll(currentStatus, keyword, pagination);
    const options = {
        items,
        filter,
        currentStatus,
        pagination,
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

    await itemsService.changeStatusById(id, newStatus);
    res.redirect(`/admin/item${query}`);
});

// Chuyển hướng trang chỉnh sửa 1 Item
router.get('/edit/:id', async (req, res, next) => {
    const { id } = req.params;
    const [{ name, status, ordering }] = await itemsService.getOneById(id);
    options = { id, name, status, ordering };
    res.render('backend/pages/items/edit', options);
});

module.exports = router;
