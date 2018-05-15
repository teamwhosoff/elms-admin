'use strict';
var mailBodyRender = require('../middleware/mail-body-render');

module.exports.requested = (req, res, next) => {

    const leave = req.Leave;

    if (req.userInContext != null && req.userInContext.email != process.env.ADMIN_EMAIL) {
        if (leave.Owner.Email != req.userInContext.email) {
            return res.status(403).send("You are not authorized user for this leave object");
        }
    }

    mailBodyRender.render('requested', leave, (err) => { next(err) }, (content) => {

        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Manager.Email,
            //cc: leave.Owner.Email,
            subject: "WhosOff - New Leave Request",
            html: content
        };

        next();
    });

}

module.exports.approved = (req, res, next) => {

    const leave = req.Leave;

    if (req.userInContext != null && req.userInContext.email != process.env.ADMIN_EMAIL) {
        if (leave.Owner.Manager.Email != req.userInContext.email) {
            return res.status(403).send("You are not authorized user for this leave object");
        }
    }

    mailBodyRender.render('approved', leave, (err) => { next(err) }, (content) => {

        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Email,
            //cc: leave.Owner.Manager.Email,
            subject: "Who's Off - Leave Request Approved",
            html: content
        };

        next();
    });

}

module.exports.declined = (req, res, next) => {

    const leave = req.Leave;

    if (req.userInContext != null && req.userInContext.email != process.env.ADMIN_EMAIL) {
        if (leave.Owner.Manager.Email != req.userInContext.email) {
            return res.status(403).send("You are not authorized user for this leave object");
        }
    }

    mailBodyRender.render('declined', leave, (err) => { next(err) }, (content) => {

        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Email,
            //cc: leave.Owner.Manager.Email,
            subject: "WhosOff - Leave Request Declined",
            html: content
        };

        next();
    });

}

module.exports.canceled = (req, res, next) => {

    const leave = req.Leave;

    if (req.userInContext != null && req.userInContext.email != process.env.ADMIN_EMAIL) {
        if (leave.Owner.Email != req.userInContext.email) {
            return res.status(403).send("You are not authorized user for this leave object");
        }
    }

    mailBodyRender.render('cancelled', leave, (err) => { next(err) }, (content) => {

        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Email,
            cc: leave.Owner.Manager.Email,
            subject: "WhosOff - Leave Request Cancelled",
            html: content
        };

        next();
    });

}


module.exports.admin = (req, res, next) => {

    const leave = req.Leave;
    const status = req.leaveStatus;

    mailBodyRender.render(status, leave, (err) => { next(err) }, (content) => {

        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Email,
            cc: leave.Owner.Manager.Email,
            subject: "WhosOff - Leave Request ",
            html: content
        };
        
        req.params.mailOptions.subject += status == "approved" ? "Approved" : "Declined";

        next();
    });

}
