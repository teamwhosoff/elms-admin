'use strict';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PWD
    }
});

module.exports = (req, res, next) => {
    transporter.sendMail(req.params.mailOptions, function (err, info) {
        if (err) {
            next(err)
        }
        else
            return res.status(200).send(info);
    });
};
