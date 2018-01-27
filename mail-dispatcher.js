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

module.exports = (req, res) => {
    transporter.sendMail(req.params.mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        else
            return res.status(200).send(info);
    });
};
