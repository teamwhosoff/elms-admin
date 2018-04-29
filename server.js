'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    verifyIdToken = require('./middleware/firebase-token-validator'),
    isAdmin = require("./middleware/is-admin"),
    mailDispatcher = require('./middleware/mail-dispatcher'),
    homeCtrl = require("./home/home-controller"),
    emailValidationCtrl = require("./email/email-validation-controller"),
    emailCtrl = require('./email/email-controller'),
    leaveOtpValidator = require("./leave/leave-otp-validation-controller"),
    leaveStatusChangeCtrl = require("./leave/leave-status-controller"),
    leaveCtrl = require("./leave/leave-controller"),
    accountsCtrl = require("./accounts/user-accounts-controller"),
    teamsCtrl = require("./team/team-controller"),
    notifyCtrl = require('./middleware/firebase-notification-trigger'),
    usersCtrl = require("./user/user-controller");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', homeCtrl);
app.get('/success', (req, res) => { res.send("Success"); })
app.get('/duringthistime', verifyIdToken, leaveCtrl.duringthistime);

app.post('/email/trigger/requested', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.requested, mailDispatcher.dispatch, notifyCtrl.notifyManager, mailDispatcher.finish);
app.post('/email/trigger/approved', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.approved, mailDispatcher.dispatch, notifyCtrl.notifyEmployee, notifyCtrl.clearNotification, mailDispatcher.finish);
app.post('/email/trigger/declined', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.declined, mailDispatcher.dispatch, notifyCtrl.notifyEmployee, notifyCtrl.clearNotification, mailDispatcher.finish);
app.post('/email/trigger/cancelled', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.canceled, mailDispatcher.dispatch, notifyCtrl.notifyManager, notifyCtrl.clearNotification, mailDispatcher.finish);

app.get('/leave/:leaveId/status/:status/otp/:otp', leaveOtpValidator, leaveStatusChangeCtrl, emailCtrl.admin, mailDispatcher.dispatchPage, notifyCtrl.notifyEmployee, mailDispatcher.adminFinish);

app.get('/accounts', verifyIdToken, isAdmin, accountsCtrl.getListOfUsers);
app.get('/accounts/:key/:value', verifyIdToken, isAdmin, accountsCtrl.getUser);
app.post('/accounts', verifyIdToken, isAdmin, accountsCtrl.createUsers);
app.put('/accounts', verifyIdToken, isAdmin, accountsCtrl.updateUsers);
app.delete('/accounts', verifyIdToken, isAdmin, accountsCtrl.deleteAll);

app.get('/teams', verifyIdToken, isAdmin, teamsCtrl.export);
app.post('/teams', verifyIdToken, isAdmin, teamsCtrl.import);

app.get('/users', verifyIdToken, isAdmin, usersCtrl.export);
app.post('/users', verifyIdToken, isAdmin, usersCtrl.import);

let server = app.listen(process.env.PORT, () => {
    console.log("App listening at http://%s:%s", server.address().address, server.address().port);
}); // taskkill /f /im node.exe
