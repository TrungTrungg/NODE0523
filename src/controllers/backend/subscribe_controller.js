const nodemailer = require('nodemailer');
const { matchedData } = require('express-validator');

const { subscribeService: service } = require('@services');
const { filterOptions, notify } = require('@utils');
const { handlepagination, catchAsync, mailHelper } = require('@helpers');
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
        { name: filterOptions.all, qty: await service.countByStatus('', keyword, '') },
        { name: filterOptions.active, qty: await service.countByStatus(filterOptions.active, keyword, '') },
        {
            name: filterOptions.inactive,
            qty: await service.countByStatus(filterOptions.inactive, keyword, ''),
        },
    ];

    const statusFilterOptions = {
        all: filterOptions.all,
        active: filterOptions.active,
        inactive: filterOptions.inactive,
    };

    // pagination, Params: currentPage, itemsPerPage, pageRange
    const totalItems = await service.countByStatus(currentStatus, keyword, '');
    const pagination = await handlepagination(totalItems, currentPage, (itemsPerPage = 10), (pageRange = 3));

    // Lấy danh sách item
    const items = await service.getAll(currentStatus, keyword, '', pagination);

    // message
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        title: 'Trang đăng ký nhận tin',

        page: 'Subscribe',
        collection: 'subscribe',
        items,
        filter,
        statusFilterOptions,
        currentStatus,
        pagination,
        keyword,
        messages,
    };
    res.render(`backend/pages/subscribe`, options);
});

const addEmailAndSend = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        req.flash('error', errors);
        res.redirect(`/`);
    } else {
        const { email } = matchedData(req);
        const findEmail = await service.getOne(email);

        if (findEmail.length <= 0) {
            await service.create(email);
            const subject = 'Xác nhận đăng ký ✔';
            const text =
                'Cảm ơn bạn đã đăng ký, giờ đây bạn sẽ nhận được tin tức quan trọng, Ưu đãi tuyệt vời & Thông tin nội bộ một cách nhanh nhất của chúng tôi';
            mailHelper.sendMail(email, subject, text);
        } else {
            res.redirect(`/`);
        }
    }
});

const sendAllMail = catchAsync(async (req, res) => {
    const { subject, text, cid } = req.body;
    let emails = cid;

    if (Array.isArray(cid)) {
        emails = cid.join(',');
    }
    mailHelper.sendMail(emails, subject, text);
    res.redirect('/admin/subscribe');
});

const deleteOne = catchAsync(async (req, res) => {
    const { id } = req.params;

    await service.deleteOneById(id);
    req.flash('success', notify.SUCCESS_DELETE);
    res.redirect(`/admin/subscribe`);
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
module.exports = {
    renderList,
    addEmailAndSend,
    sendAllMail,
    deleteOne,
    changeStatusAjax,
};
