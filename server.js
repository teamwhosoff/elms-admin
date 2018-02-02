'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    verifyIdToken = require('./middleware/firebase-token-validator'),
    mailDispatcher = require('./middleware/mail-dispatcher'),
    homeCtrl = require("./home/home-controller"),
    emailValidationCtrl = require("./email/email-validation-controller"),
    emailCtrl = require('./email/email-controller'),
    leaveStatusChangeCtrl = require("./email/leave-statuschange-controller"),
    leaveCtrl = require("./leave/leave-controller");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', homeCtrl);
app.get('/duringthistime', verifyIdToken, leaveCtrl.duringthistime);

app.get('/requested', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.requested, mailDispatcher.dispatch, mailDispatcher.finish);
app.get('/approved', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.approved, mailDispatcher.dispatch, mailDispatcher.finish);
app.get('/declined', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.declined, mailDispatcher.dispatch, mailDispatcher.finish);
app.get('/cancelled', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.canceled, mailDispatcher.dispatch, mailDispatcher.finish);

let server = app.listen(process.env.PORT, () => {
    console.log("App listening at http://%s:%s", server.address().address, server.address().port);
}); // taskkill /f /im node.exe
