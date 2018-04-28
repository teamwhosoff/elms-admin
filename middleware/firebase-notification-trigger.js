'use strict';
var admin = require('firebase-admin');
var store = admin.firestore();

var clearNotification = (notification) => {
    this.store.collection('eNotifications').doc(notification.sourceUserID)
    .collection('notifications', ref => ref.where('leaveId', '==', notification.leaveId))
    .snapshotChanges().subscribe((items) => {
        items.forEach(item => {
            // console.log(item);
            item.payload.doc.ref.delete().then(() => {
                this.getMyNotificationDetails();
                console.log("Notification successfully deleted!");
              }).catch(function(error) {
                this.getMyNotificationDetails();
                console.error("Error removing Notification: ", error);
              });
        })            
    })
}

module.exports.notifyManager =(req, res) => {

    let leave = req.Leave;

    let notification = {
        leaveId: req.query.leaveId,
        targetUserID: leave.Owner.Manager.Email,
        sourceUserID: leave.Owner.Email
    }

    clearNotification(notification);
    console.log(notification);

    store.collection('eNotifications').doc(notification.targetUserID)
        .collection('notifications').add(notification).then(result => {
            console.log('notification');
            console.log(result);
          }).catch(err => { console.log(err); });

}

module.exports.notifyEmployee =(req, res) => {

    let leave = req.Leave;

    let notification = {
        leaveId: req.query.leaveId,
        targetUserID: leave.Owner.Email,
        sourceUserID: leave.Owner.Manager.Email
    }

    clearNotification(notification);
    console.log(notification);

    store.collection('eNotifications').doc(notification.targetUserID)
        .collection('notifications').add(notification).then(result => {
            console.log('notification');
            console.log(result);
          }).catch(err => { console.log(err); });
    
}

