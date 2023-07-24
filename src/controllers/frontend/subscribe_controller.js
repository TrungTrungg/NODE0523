const nodemailer = require('nodemailer');
const { matchedData } = require('express-validator');

const { subscribeService: service } = require('@services');
const { filterOptions, notify } = require('@utils');
const { catchAsync } = require('@helpers');
const { resultsValidator } = require('@validators');

const addEmailAndSend = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, message: errors });
    } else {
        const { email } = matchedData(req);
        const findEmail = await service.getOne(email);

        if (findEmail.length <= 0) {
            await service.create(email);
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'xuantrung97tn@gmail.com',
                    pass: 'yoatevjhaqeovxqa',
                },
            });

            const mailOptions = {
                from: 'xuantrung97tn@gmail.com',
                to: email,
                subject: 'Xác nhận đăng ký ✔',
                text: 'Cảm ơn bạn đã đăng ký, giờ đây bạn sẽ nhận được tin tức quan trọng, Ưu đãi tuyệt vời & Thông tin nội bộ một cách nhanh nhất của chúng tôi',
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    res.send({ success: true, message: 'đăng ký thành công!' });
                }
            });
        } else {
            res.send({ error: true, message: [{ path: 'Email', msg: 'email này đã đăng ký!' }] });
        }
    }
});

module.exports = {
    addEmailAndSend,
};
