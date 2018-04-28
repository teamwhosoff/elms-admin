'use strict';
const nodemailer = require('nodemailer');
var path = require('path');

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

module.exports.dispatch = (req, res, next) => {

    if (req.params.mailOptions) {
        //console.log(req.params.mailOptions);
        transporter.sendMail(req.params.mailOptions, function(err, info) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                next();
            }
            else {
                console.log(info);
                res.status(200).send(info);
                next();
            }
        });
    }
    else {
        console.log("Mail skipped");
        next();
    }
};

module.exports.dispatchPage = (req, res, next) => {

    if (req.params.mailOptions) {
        //console.log(req.params.mailOptions);
        transporter.sendMail(req.params.mailOptions, function(err, info) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                next();
            }
            else {
                console.log(info);
                res.render(path.resolve(__dirname,"../leave/templates/done.jade"));
                next();
            }
        });
    }
    else {
        console.log("Mail skipped");
    }
};

module.exports.finish = (req, res) => {
    console.log("Done");
}

module.exports.adminFinish = (req, res) => {
    console.log("Done");
}
