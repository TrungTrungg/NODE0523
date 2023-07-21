const server = require('../bin/www');
const { Server } = require('socket.io');
const io = new Server(server);

let shop = [];
let blog = [];

io.on('connection', (socket) => {
    socket.on('shop', (data) => {
        shop.push(socket.id);
    });
    socket.on('blog', (data) => {
        blog.push(socket.id);
    });
    socket.on('disconnect', () => {
        shop = shop.filter((id) => id !== socket.id);
        blog = blog.filter((id) => id !== socket.id);
    });
    setInterval(() => {
        socket.emit('dasboard-shop', shop.length);
        socket.emit('dasboard-blog', blog.length);
    }, 500);
});
