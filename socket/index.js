const server = require('../bin/www');
const { Server } = require('socket.io');
const io = new Server(server);
const fs = require('fs');

let userInfo = {};
let dataFile = fs.readFileSync('./userData.txt', 'utf-8');
if (dataFile) userInfo = JSON.parse(dataFile);

io.on('connection', (socket) => {
    // if (userInfo !== {}) {
    //     for (const router in userInfo) {
    //         console.log('connection', router, userInfo[router].length);
    //         socket.emit(router, userInfo[router].length);
    //     }
    // }
    socket.on('router', (data) => {
        if (!userInfo[data]) userInfo[data] = [];
        userInfo[data].push(socket.id);
        fs.writeFileSync('./userData.txt', JSON.stringify(userInfo));
        socket.emit('shop', userInfo[data].length);
        console.log('on', data, userInfo[data].length);
    });

    socket.on('disconnect', () => {
        for (const router in userInfo) {
            userInfo[router] = userInfo[router].filter((data) => data !== socket.id);
            socket.emit(router, userInfo[router].length);
            console.log('disconnect', router, userInfo[router].length);
        }
        fs.writeFileSync('./userData.txt', JSON.stringify(userInfo));
    });
});
