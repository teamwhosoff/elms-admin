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
    leaveCtrl = require("./leave/leave-controller"),
    accountsCtrl = require("./accounts/user-accounts-controller"),
    teamsCtrl = require("./team/team-controller"),
    usersCtrl = require("./user/user-controller");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', homeCtrl);
app.get('/duringthistime', verifyIdToken, leaveCtrl.duringthistime);

app.post('/email/trigger/requested', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.requested, mailDispatcher.dispatch, mailDispatcher.finish);
app.post('/email/trigger/approved', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.approved, mailDispatcher.dispatch, mailDispatcher.finish);
app.post('/email/trigger/declined', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.declined, mailDispatcher.dispatch, mailDispatcher.finish);
app.post('/email/trigger/cancelled', verifyIdToken, leaveCtrl.getLeaveByID, emailValidationCtrl.validate, emailCtrl.canceled, mailDispatcher.dispatch, mailDispatcher.finish);

app.get('/accounts', accountsCtrl.getListOfUsers);
app.get('/accounts/:key/:value', accountsCtrl.getUser);
app.post('/accounts', accountsCtrl.createUsers);
app.put('/accounts', accountsCtrl.updateUsers);
app.delete('/accounts', accountsCtrl.deleteUsers);

app.get('/teams', teamsCtrl.export);
app.post('/teams', teamsCtrl.import);

app.get('/users', usersCtrl.export);
app.post('/users', usersCtrl.import);

let server = app.listen(8081, () => {
    console.log("App listening at http://%s:%s", server.address().address, server.address().port);
}); // taskkill /f /im node.exe
