'use strict';
var admin = require('firebase-admin');
var store = admin.firestore();

module.exports.notifyManager =(req, res, next) => {

    let leave = req.Leave;

    let notification = {
        leaveId: req.query.leaveId,
        targetUserID: leave.Owner.Manager.Email,
        sourceUserID: leave.Owner.Email
    }

    store.collection('eNotifications').doc(notification.targetUserID)
        .collection('notifications').add(notification).then(result => {
            console.log('notification');
            console.log(result);
            next();
          }).catch(err => { console.log(err); next(); });

}

module.exports.notifyEmployee =(req, res, next) => {

    let leave = req.Leave;

    let notification = {
        leaveId: req.query.leaveId,
        targetUserID: leave.Owner.Email,
        sourceUserID: leave.Owner.Manager.Email
    }

    store.collection('eNotifications').doc(notification.targetUserID)
        .collection('notifications').add(notification).then(result => {
            console.log('notification');
            console.log(result);
            next();
          }).catch(err => { console.log(err); next(); });
    
}