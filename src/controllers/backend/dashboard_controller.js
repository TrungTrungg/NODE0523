const { productService, articleService, userService, orderService } = require('@services');
const { catchAsync } = require('@helpers');
const { promises } = require('nodemailer/lib/xoauth2');

const renderDashboard = catchAsync(async (req, res) => {
    const [products, articles, users, orders, latestOrders] = await Promise.all([
        productService.countAll(),
        articleService.countAll(),
        userService.countAll(),
        orderService.countAll(),
        orderService.getLatest(10),
    ]);
    const statisticArr = [
        { name: 'Sản phẩm', qty: products, icon: 'ion-stats-bars', color: 'danger', url: '/admin/product' },
        { name: 'Bài viết', qty: articles, icon: 'ion-pie-graph', color: 'warning', url: '/admin/article' },
        { name: 'Người dùng', qty: users, icon: 'ion-person-add', color: 'primary', url: '/admin/user' },
        { name: 'Đơn hàng', qty: orders, icon: 'ion-bag', color: 'success', url: '/admin/order' },
    ];

    const options = {
        page: 'Dashboard',
        statisticArr,
        latestOrders,
    };
    res.render('backend/pages/dashboard', options);
});

module.exports = {
    renderDashboard,
};
