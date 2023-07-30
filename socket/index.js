const server = require('../bin/www');
const { Server } = require('socket.io');
const io = new Server(server);
const { fsHelper } = require('@helpers');

let userInfo = {};
if (!fsHelper.checkFileExist('src/files/socketData.txt')) fsHelper.writeFile('src/files/socketData.txt', '[]');

let dataFile = fsHelper.readFile('src/files/socketData.txt', 'Async');
if (dataFile) userInfo = JSON.parse(dataFile);

io.on('connection', (socket) => {
    socket.on('dashboard-blog', (data) => {
        io.emit('dashboard-blog', data);
    });
    socket.on('dashboard-shop', (data) => {
        io.emit('dashboard-shop', data);
    });
    socket.on('router', (data) => {
        if (data === 'dashboard') {
            for (const router in userInfo) {
                io.emit(router, userInfo[router].length);
                socket.on(router, (data) => {
                    io.emit(`dashboard-${router}`, data);
                });
            }
        } else {
            if (!userInfo[data]) userInfo[data] = [];
            userInfo[data].push(socket.id);
            fsHelper.writeFile('src/files/socketData.txt', userInfo, 'Sync');
            io.emit(data, userInfo[data].length);
        }
    });

    socket.on('shop-coupon', (data) => {
        io.emit('shop-coupon', data);
    });
    socket.on('blog-coupon', (data) => {
        io.emit('blog-coupon', data);
    });

    socket.on('disconnect', () => {
        for (const router in userInfo) {
            userInfo[router] = userInfo[router].filter((data) => data !== socket.id);
            io.emit(router, userInfo[router].length);
        }
        fsHelper.writeFile('src/files/socketData.txt', userInfo, 'Async');
    });
});
