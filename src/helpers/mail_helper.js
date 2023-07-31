const nodemailer = require('nodemailer');

const sendMail = (email, subject, text) => {
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
        subject: subject,
        html: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/');
        }
    });
};

module.exports = { sendMail };
