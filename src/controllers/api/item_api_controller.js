const { itemService } = require('@services');

const get_item = async (req, res) => {
    const { status } = req.params;
    const { search, page } = req.query;

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const pagination = await handlePagination(keyword, currentStatus, currentPage, (itemsPerPage = 2));
    // Lấy danh sách item
    const items = await itemService.getAll(currentStatus, keyword, pagination);

    res.render(items);
};

const add_item = (req, res) => {
    const { name, status, ordering, category_id } = req.body;
    const newItem = itemService.create(name, status, ordering, category_id);
    res.send(newItem);
};

module.exports = {
    add_item,
    get_item,
};
