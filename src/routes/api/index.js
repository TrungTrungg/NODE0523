const express = require('express');
const router = express.Router();
const { userService } = require('@services');
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

module.exports = router;
