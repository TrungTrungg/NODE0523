const express = require('express');
const router = express.Router();
const { userService, deliveryService } = require('@services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use('/', (req, res, next) => {
    res.locals.layout = 'api';
    next();
});

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await userService.create({ username, password });
    res.send({ username: user.username, password: user.password, message: 'Success!!!' });
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userService.getOne(email);
    const match = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1800s' });
    res.setHeader('Authorization', `Bearer ${token}`);
    if (match) res.send({ email, token });
    else res.send({ message: 'Failed!!!' });
});

router.get(
    '/getData',
    (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, 'secret', (err, user) => {
            console.log(err);

            if (err) return res.sendStatus(403);

            req.user = user;

            next();
        });
    },
    async (req, res, next) => {
        res.send(req.user);
    },
);

router.get('/location', async (req, res, next) => {
    const tinhThanhVietNam = [
        'Thành phố Hồ Chí Minh',
        'Hà Nội',
        'Hải Phòng',
        'Đà Nẵng',
        'Cần Thơ',
        'An Giang',
        'Bà Rịa - Vũng Tàu',
        'Bạc Liêu',
        'Bắc Kạn',
        'Bắc Giang',
        'Bắc Ninh',
        'Bến Tre',
        'Bình Dương',
        'Bình Định',
        'Bình Phước',
        'Bình Thuận',
        'Cà Mau',
        'Cao Bằng',
        'Đắk Lắk',
        'Đắk Nông',
        'Điện Biên',
        'Đồng Nai',
        'Đồng Tháp',
        'Gia Lai',
        'Hà Giang',
        'Hà Nam',
        'Hà Tĩnh',
        'Hải Dương',
        'Hậu Giang',
        'Hòa Bình',
        'Hưng Yên',
        'Khánh Hòa',
        'Kiên Giang',
        'Kon Tum',
        'Lai Châu',
        'Lâm Đồng',
        'Lạng Sơn',
        'Lào Cai',
        'Long An',
        'Nam Định',
        'Nghệ An',
        'Ninh Bình',
        'Ninh Thuận',
        'Phú Thọ',
        'Phú Yên',
        'Quảng Bình',
        'Quảng Nam',
        'Quảng Ngãi',
        'Quảng Ninh',
        'Quảng Trị',
        'Sóc Trăng',
        'Sơn La',
        'Tây Ninh',
        'Thái Bình',
        'Thái Nguyên',
        'Thanh Hóa',
        'Thừa Thiên Huế',
        'Tiền Giang',
        'Trà Vinh',
        'Tuyên Quang',
        'Vĩnh Long',
        'Vĩnh Phúc',
        'Yên Bái',
    ];

    for (let i = 0; i < tinhThanhVietNam.length; i++) {
        await deliveryService.create(tinhThanhVietNam[i], 'active', 30000);
    }
});

module.exports = router;
