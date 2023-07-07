const express = require('express');
const router = express.Router();
const { userModel } = require('@models');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await userModel.create({ username, password });
    res.send({ username: user.username, password: user.password, message: 'Success!!!' });
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    const match = await bcrypt.compare(password, user.password);
    if (match) res.send({ message: 'Success!!!' });
    else res.send({ message: 'Failed!!!' });
});

module.exports = router;
