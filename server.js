'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mailDispatcher = require('./middleware/mail-dispatcher'),
    homeCtrl = require("./home/home-controller"),
    emailValidationCtrl = require("./email/email-validation-controller"),
    emailCtrl = require('./email/email-controller');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', homeCtrl);

app.post('/requested', emailValidationCtrl.validate, emailCtrl.requested, mailDispatcher);
app.post('/approved', emailValidationCtrl.validate, emailCtrl.approved, mailDispatcher);
app.post('/declined', emailValidationCtrl.validate, emailCtrl.declined, mailDispatcher);
app.post('/cancelled', emailValidationCtrl.validate, emailCtrl.canceled, mailDispatcher);

let server = app.listen(process.env.PORT, () => {
    console.log("App listening at http://%s:%s", server.address().address, server.address().port);
}); // taskkill /f /im node.exe
