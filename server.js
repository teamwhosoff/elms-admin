'use strict';

const
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mailDispatcher = require('./mail-dispatcher'),
    leavesCtrl = require('./leaves-controller');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + "\\home.html"));
});

app.post('/requested', leavesCtrl.validate, leavesCtrl.requested, mailDispatcher);
app.post('/approved', leavesCtrl.validate, leavesCtrl.approved, mailDispatcher);
app.post('/declined', leavesCtrl.validate, leavesCtrl.declined, mailDispatcher);
app.post('/cancelled', leavesCtrl.validate, leavesCtrl.canceled, mailDispatcher);

onServerStart = () => {
    console.log("App listening at http://%s:%s", server.address().address, server.address().port);
};

let server = app.listen(process.env.PORT | 8081, onServerStart); // taskkill /f /im node.exe