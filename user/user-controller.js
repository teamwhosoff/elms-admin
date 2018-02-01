var moment = require('moment');
var admin = require('firebase-admin');
var auth = admin.auth();

module.exports.getToken = (req, res, next) => {
    
    var emailid = req.headers['emailid'];
    var password = req.headers['password'];
    
}