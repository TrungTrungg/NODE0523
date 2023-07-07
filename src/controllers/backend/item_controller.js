const { matchedData } = require('express-validator');
const unidecode = require('unidecode');
const fs = require('fs');
let Parser = require('rss-parser');
let parser = new Parser();

const { itemService: service } = require('@services');
const { filterOptions, notify, itemCollection: collection } = require('@utils');
const { handlePagination, catchAsync } = require('@helpers');
const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res, next) => {
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
        { name: filterOptions.inactive, qty: await service.countByStatus(filterOptions.inactive, keyword) },
    ];

    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 3), (pageRange = 3));
    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, pagination);
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
const renderAddPage = catchAsync(async (req, res, next) => {
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
const addOne = catchAsync(async (req, res, next) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/add`);
    } else {
        let image = '';
        if (req.file) image = req.file.filename;

        const { name, status, ordering } = matchedData(req);
        const { categoryId } = req.body;
        if (categoryId) categoryId;
        const slug = name
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        await service.create(name, status.toLowerCase(), ordering, slug, image, categoryId);
        req.flash('success', notify.SUCCESS_ADD);
        res.redirect(`/admin/${collection}`);
    }
});

// delete one item
const deleteOne = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const { image } = await service.getOneById(id);
    const imagePath = `public\\backend\\uploads\\${image}`;
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    await service.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect(`/admin/${collection}`);
});

// render Edit item page
const renderEditPage = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, status, ordering, image } = await service.getOneById(id);

    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = { page: 'Item', collection, id, name, status, ordering, image, messages };
    res.render(`backend/pages/${collection}/${collection}_edit`, options);
});

// Edit item
const editOne = catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/edit/${id}`);
    } else {
        // Xử lý ảnh
        let imageName = '';
        if (req.file) imageName = req.file.filename;

        const { image } = await service.getOneById(id);
        const imagePath = `public\\backend\\uploads\\${image}`;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        const { name, status, ordering } = matchedData(req);
        const slug = name
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        const newItem = await service.updateOneById(id, name, status.toLowerCase(), ordering, slug, imageName);
        req.flash('success', notify.SUCCESS_EDIT);
        res.redirect(`/admin/${collection}`);
    }
});

// Change status of item
const changeStatus = catchAsync(async (req, res, next) => {
    const { id, status } = req.params;
    const { page, search } = req.query;

    // handle query
    let query = `?page=1`;
    if (search) query += `&search=${search}`;

    // handle change status
    let newStatus = status;
    if (newStatus === filterOptions.active.toLowerCase()) newStatus = filterOptions.inactive;
    else newStatus = filterOptions.active;

    await service.changeStatusById(id, newStatus.toLowerCase());
    req.flash('success', notify.SUCCESS_CHANGE_STATUS);
    res.redirect(`/admin/${collection}${query}`);
});

const changeStatusAjax = catchAsync(async (req, res, next) => {
    const { id, status } = req.params;
    const { search } = req.query;
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();
    // handle change status
    let newStatus = status;
    if (newStatus === filterOptions.active.toLowerCase()) newStatus = filterOptions.inactive;
    else newStatus = filterOptions.active;

    await service.changeStatusById(id, newStatus.toLowerCase());
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

const changeOrderingAjax = catchAsync(async (req, res, next) => {
    const { id, ordering } = req.params;
    if (isNaN(ordering)) {
        res.send({ error: true, message: notify.ERROR_ORDERING_VALUE });
    } else {
        // handle change status
        let newOrdering = parseInt(ordering);

        await service.changeOrderingById(id, newOrdering);
        res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, ordering: newOrdering });
    }
});

const getDataRss = async (req, res) => {
    if (fs.existsSync('blog.json')) {
        let data = fs.readFileSync('blog.json', 'utf-8');
        let parseData = JSON.parse(data);
        let then = '';
        let now = new Date();
        const newData = parseData.forEach((item) => {
            then = new Date(item.date);
        });

        if (now - then === 1) {
            const feed = await parser.parseURL('https://vnexpress.net/rss/tin-moi-nhat.rss');
            const newFeed = feed.items.map((item) => {
                item.date = new Date();
                return item;
            });
            fs.writeFileSync('blog.json', JSON.stringify(newFeed), 'utf-8');
            data = fs.readFileSync('blog.json', 'utf-8');
            parseData = JSON.parse(data);
            console.log('read server');
            res.send(parseData);
        }
        res.send(parseData);
    } else {
        const feed = await parser.parseURL('https://vnexpress.net/rss/tin-moi-nhat.rss');
        feed.date = new Date();
        fs.writeFileSync('blog.json', JSON.stringify(newFeed), 'utf-8');
        const data = fs.readFileSync('blog.json', 'utf-8');
        const parseData = JSON.parse(data);
        console.log('read server');
        res.send(parseData);
    }
};

module.exports = {
    renderList,
    renderAddPage,
    addOne,
    deleteOne,
    renderEditPage,
    editOne,
    changeStatus,
    changeStatusAjax,
    changeOrderingAjax,
    getDataRss,
};
