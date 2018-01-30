'use strict';
var mailBodyRender = require('./mail-body-render');

module.exports.validate = (req, res, next) => {

    const leave = req.body;

    if (!leave) {
        next("Leave object is missing");
    }
    if (!leave.FromDTTM || !leave.ToDTTM) {
        next("FromDTTM or ToDTTM of leave object is missing");
    }
    if (!leave.Comments) {
        next("Comments of leave object is missing");
    }
    if (!leave.Owner || !leave.Owner.Name || !leave.Owner.Email) {
        next("Owner details in leave object is missing");
    }
    if (!leave.Owner.Manager || !leave.Owner.Manager.Name || !leave.Owner.Manager.Email) {
        next("Manager details in leave owner object is missing");
    }
    next();
}

module.exports.requested = (req, res, next) => {

    const leave = req.body;

    mailBodyRender.render('requested', leave, (err) => { next(err) }, (content) => {
        
        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Manager.Email,
            //cc: leave.Owner.Email,
            subject: "Who's Off - New Leave Request",
            html: content
        };

        next();
    });

}

module.exports.approved = (req, res, next) => {

    const leave = req.body;

    mailBodyRender.render('approved', leave, (err) => { next(err) }, (content) => {
        
        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Email,
            cc: leave.Owner.Manager.Email,
            subject: "Who's Off - Leave Request Approved",
            html: content
        };

        next();
    });

}

module.exports.declined = (req, res, next) => {

    const leave = req.body;

    mailBodyRender.render('declined', leave, (err) => { next(err) }, (content) => {
        
        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Email,
            cc: leave.Owner.Manager.Email,
            subject: "Who's Off - Leave Request Declined",
            html: content
        };

        next();
    });

}

module.exports.canceled = (req, res, next) => {

    const leave = req.body;

    mailBodyRender.render('cancelled', leave, (err) => { next(err) }, (content) => {
        
        req.params.mailOptions = {
            from: process.env.GMAIL_ID,
            to: leave.Owner.Manager.Email,
            cc: leave.Owner.Email,
            subject: "Who's Off - Leave Request Cancelled",
            html: content
        };

        next();
    });

}
