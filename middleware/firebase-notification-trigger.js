'use strict';
var admin = require('firebase-admin');
var store = admin.firestore();

module.exports.clearNotification = (req, res, next) => {

    let notification = req.managerNotification || req.employeeNotification;

    console.log(notification);

    store.collection('eNotifications/' + notification.sourceUserID + '/notifications')
        .where('leaveId', '==', notification.leaveId)
        .onSnapshot(querySnap => {
            console.log(querySnap);
            querySnap.forEach(doc => {
                console.log(doc.id, " => ", doc.data());
                doc.ref.delete().then(() => {
                    console.log("Notification successfully deleted!");
                    next();
                }).catch(function (error) {
                    console.error("Error removing Notification: ", error);
                    next();
                });
            })
        }, err => { console.log(err); next(); })    

}

var addNewNotification = (notification, next) => {

    store.collection('eNotifications').doc(notification.targetUserID)
    .collection('notifications').add(notification).then(result => {
        console.log('notification');
        // console.log(result);
        next();
    }).catch(err => { console.log(err); next(); });

    // store.collection('eNotifications/' + notification.sourceUserID + '/notifications')
    //     .where('leaveId', '==', notification.leaveId)
    //     .onSnapshot(querySnap => {
    //         if(querySnap.empty)
    //         {
    //             store.collection('eNotifications').doc(notification.targetUserID)
    //             .collection('notifications').add(notification).then(result => {
    //                 console.log('notification');
    //                 // console.log(result);
    //                 next();
    //             }).catch(err => { console.log(err); next(); });
    //         }
    //     }, err => { console.log(err); next(); })  
}

module.exports.notifyManager = (req, res, next) => {

    let leave = req.Leave;

    let notification = {
        leaveId: req.query.leaveId,
        targetUserID: leave.Owner.Manager.Email,
        sourceUserID: leave.Owner.Email
    }

    console.log(notification);
    req.managerNotification = notification;

    addNewNotification(notification, next);

}

module.exports.notifyEmployee = (req, res, next) => {

    let leave = req.Leave;

    let notification = {
        leaveId: req.query.leaveId,
        targetUserID: leave.Owner.Email,
        sourceUserID: leave.Owner.Manager.Email
    }

    console.log(notification);
    req.employeeNotification = notification;

    addNewNotification(notification, next);

}

