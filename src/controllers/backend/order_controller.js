const fs = require('fs');

const { orderService: service, productService, userService, couponService, deliveryService } = require('@services');
const { orderStatusOptions, notify, orderCollection: collection } = require('@utils');
const { handlepagination, catchAsync } = require('@helpers');

// render list items, filter status, pagination
const renderList = catchAsync(async (req, res) => {
    const { status } = req.params;
    const { search, page } = req.query;

    // Xử lý status
    let currentStatus = status;
    if (currentStatus !== undefined) {
        currentStatus = status === orderStatusOptions.all ? undefined : status;
    }

    // Xử lý query
    let keyword = '';
    if (search) keyword = !search.trim() ? '' : search.trim();

    // Xử lý page
    let currentPage = 1;
    if (page) currentPage = parseInt(page);

    // Tạo dữ liệu cho filter
    const filter = [
        { name: orderStatusOptions.all, qty: await service.countByStatus('', keyword) },
        {
            name: orderStatusOptions.done,
            qty: await service.countByStatus(orderStatusOptions.done, keyword),
        },
        {
            name: orderStatusOptions.not,
            qty: await service.countByStatus(orderStatusOptions.not, keyword),
        },
        {
            name: orderStatusOptions.cancel,
            qty: await service.countByStatus(orderStatusOptions.cancel, keyword),
        },
    ];

    const statusFilterOptions = {
        all: orderStatusOptions.all,
        done: orderStatusOptions.done,
        not: orderStatusOptions.not,
        cancel: orderStatusOptions.cancel,
    };

    const selectStatusOption = [
        { name: orderStatusOptions.not, value: orderStatusOptions.not },
        { name: orderStatusOptions.done, value: orderStatusOptions.done },
        { name: orderStatusOptions.cancel, value: orderStatusOptions.cancel },
    ];

    // pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword);
    const pagination = await handlepagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, pagination);
    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        title: 'Trang đơn hàng',

        page: collection,
        collection,
        items,
        filter,
        statusFilterOptions,
        selectStatusOption,
        currentStatus,
        pagination,
        keyword,
        messages,
    };
    res.render(`backend/pages/${collection}`, options);
});
const renderDetail = catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await service.getOneById(id);

    const productIds = order.product.map((item) => {
        return item.product_id;
    });
    const products = await productService.getProducts(productIds);
    const user = await userService.getOne(order.user.email);
    let userInfo = '';
    if (user) userInfo = user;
    let coupon = '';
    if (order.coupon_id) {
        coupon = await couponService.getOneById(order.coupon_id);
    }
    const delivery = await deliveryService.getOneById(order.delivery_id);
    const options = {
        title: 'Trang chi tiết đơn hàng',

        page: 'Detail',
        collection,
        order,
        userInfo,
        coupon,
        delivery,
        products,
    };

    res.render(`backend/pages/${collection}/detail`, options);
});
const changeStatusAjax = catchAsync(async (req, res) => {
    const { id, status } = req.body;
    let keyword = '';
    // if (search) keyword = !search.trim() ? '' : search.trim();
    // handle change status

    await service.changeFieldById(id, 'status', status.toLowerCase());

    const allStatus = {
        name: orderStatusOptions.all,
        count: await service.countByStatus('', keyword),
    };

    const doneStatus = {
        name: orderStatusOptions.done,
        count: await service.countByStatus(orderStatusOptions.done, keyword),
    };

    const notStatus = {
        name: orderStatusOptions.not,
        count: await service.countByStatus(orderStatusOptions.not, keyword),
    };
    const cancleStatus = {
        name: orderStatusOptions.cancel,
        count: await service.countByStatus(orderStatusOptions.cancel, keyword),
    };
    res.send({
        success: true,
        message: notify.SUCCESS_CHANGE_STATUS,
        filter: { allStatus, doneStatus, notStatus, cancleStatus },
    });
});

module.exports = {
    renderList,
    renderDetail,
    changeStatusAjax,
};
