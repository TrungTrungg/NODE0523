const { contactService: service } = require('@services');
const { catchAsync } = require('@helpers');
const { contactCollection: collection } = require('@utils');

const renderContact = catchAsync(async (req, res) => {
    const options = {
        page: 'Trang liên hệ',
        pageDesc: '',
    };
    res.render('frontend/pages/contact', options);
});
const handleContactAjax = catchAsync(async (req, res) => {
    const { name, email, phone, message } = req.body;
    await service.create(name, email, phone, message);
    res.send({ success: true, message: 'Liên hệ thành công!' });
});
module.exports = {
    renderContact,
    handleContactAjax,
};
