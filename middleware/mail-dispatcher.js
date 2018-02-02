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

module.exports.dispatch = (req, res) => {
    //console.log(req.params.mailOptions);
    transporter.sendMail(req.params.mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            console.log(info);
            res.status(200).send(info);
        }
    });
};

module.exports.finish = (req, res) => {
    console.log("Done");
}