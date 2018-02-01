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
app.get('/duringthistime/:leaveId', leaveCtrl);

app.post('/requested', verifyIdToken, emailValidationCtrl.validate, emailCtrl.requested, mailDispatcher);
app.post('/approved', verifyIdToken, emailValidationCtrl.validate, emailCtrl.approved, mailDispatcher);
app.post('/declined', verifyIdToken, emailValidationCtrl.validate, emailCtrl.declined, mailDispatcher);
app.post('/cancelled', verifyIdToken, emailValidationCtrl.validate, emailCtrl.canceled, mailDispatcher);

let server = app.listen(process.env.PORT, () => {
    console.log("App listening at http://%s:%s", server.address().address, server.address().port);
}); // taskkill /f /im node.exe
