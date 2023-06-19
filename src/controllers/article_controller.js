const { matchedData } = require('express-validator');

const { articleService: service, categoryService } = require('@services');
const { filterOptions, notify, articleCollection: collection } = require('@utils');
const { handlePagination } = require('@helpers');
const { resultsValidator } = require('@validators');

// render list items, filter status, pagination
const renderList = async (req, res) => {
    const { status } = req.params;
    const { search, page, category } = req.query;

    // Xử lý status
    let currentStatus = status;
    if (currentStatus !== undefined) {
        currentStatus = status === filterOptions.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    let category_id = '';
    if (category) category_id = category;

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: filterOptions.all, qty: await service.countByStatus('', keyword, category_id) },
        { name: filterOptions.active, qty: await service.countByStatus(filterOptions.active, keyword, category_id) },
        {
            name: filterOptions.inactive,
            qty: await service.countByStatus(filterOptions.inactive, keyword, category_id),
        },
    ];

    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // Pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword, category_id);
    const pagination = await handlePagination(totalItems, currentPage, (itemsPerPage = 3), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, category_id, pagination);

    // categories
    const results = await categoryService.getAllNameId();

    const categories = results.map((result) => {
        const { _id, name } = result;
        return { value: _id, name };
    });

    let cateName = '';
    if (category_id) cateName = await categoryService.getCateName(category_id);

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
        categories,
        cateName,
        messages,
    };
    res.render(`backend/pages/${collection}`, options);
};

// render add item page
const renderAddPage = async (req, res) => {
    const results = await categoryService.getAllNameId();

    const categories = results.map((result) => {
        const { _id, name } = result;
        return { value: _id, name };
    });
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Add',
        collection,
        categories,
        messages,
    };
    res.render(`backend/pages/${collection}/${collection}_add`, options);
};

// add item
const addOne = async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/admin/${collection}/add`);
    } else {
        let image = '';
        if (req.file) image = req.file.filename;

        const { name, author, status, ordering, category_id, description } = matchedData(req);
        const slug = name
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        await service.create(name, author, status.toLowerCase(), ordering, slug, image, category_id, description);
        req.flash('success', notify.SUCCESS_ADD);
        res.redirect(`/admin/${collection}`);
    }
};

// delete one item
const deleteOne = async (req, res) => {
    const { id } = req.params;
    // Xóa ảnh trong folder
    const { image } = await service.getOneById(id);
    const imagePath = `public\\backend\\uploads\\${image}`;
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    await service.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect(`/admin/${collection}`);
};

// render Edit item page
const renderEditPage = async (req, res) => {
    const { id } = req.params;
    const { name, author, status, ordering, image, category_id, description } = await service.getOneById(id);
    const results = await categoryService.getAllNameId();
    const categories = results.map((result) => {
        const { _id, name } = result;
        return { value: _id, name };
    });
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Item',
        collection,
        id,
        name,
        author,
        status,
        ordering,
        image,
        messages,
        category_id,
        description,
        categories,
    };
    res.render(`backend/pages/${collection}/${collection}_edit`, options);
};

// Edit item
const editOne = async (req, res) => {
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
        // Lấy data sau khi validate
        const { name, author, status, ordering, category_id, description } = matchedData(req);
        // slug
        const slug = name
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/gi, '-')
            .trim();
        // update
        await service.updateOneById(
            id,
            name,
            author,
            status.toLowerCase(),
            ordering,
            slug,
            imageName,
            category_id,
            description,
        );
        // message và chuyển hướng
        req.flash('success', notify.SUCCESS_EDIT);
        res.redirect(`/admin/${collection}`);
    }
};

// Change status of item
const changeStatus = async (req, res) => {
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
    res.redirect(`/admin/item${query}`);
};

const changeStatusAjax = async (req, res) => {
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
};

const changeOrderingAjax = async (req, res) => {
    const { id, ordering } = req.params;
    if (isNaN(ordering)) {
        res.send({ error: true, message: notify.ERROR_ORDERING_VALUE });
    } else {
        // handle change status
        let newOrdering = parseInt(ordering);

        await service.changeOrderingById(id, newOrdering);
        res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING, ordering: newOrdering });
    }
};

const getListCategoriesAjax = async (req, res) => {
    const { category_id } = req.params;
    const results = await categoryService.getNameIdSub(category_id);

    const categories = results.map((result) => {
        const { _id, name } = result;
        return { value: _id, name };
    });
    res.send({ success: true, categories });
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
    getListCategoriesAjax,
};
