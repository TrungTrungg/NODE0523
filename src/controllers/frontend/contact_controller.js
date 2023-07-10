const { articleService, categoryService } = require('@services');
const { catchAsync } = require('@helpers');
const { contactCollection: collection } = require('@utils');

const renderContact = catchAsync(async (req, res) => {
    const options = {
        page: 'Trang liên hệ',
        pageDesc: '',
    };
    res.render('frontend/pages/contact', options);
});

module.exports = {
    renderContact,
};
