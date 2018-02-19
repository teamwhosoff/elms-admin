const moment = require('moment-timezone');
// var moment1 = require("moment-weekday-calc");
var admin = require('firebase-admin');
var store = admin.firestore();
var crypto = require('crypto');

module.exports.duringthistime = (req, res, next) => {

    if (!req.query.leaveId) {
        return res.status(404).send("Leave ID can't be empty")
    }

    store.collection('eLeaves').doc(req.query.leaveId).get().then(leave => {
        if (leave.exists) {
            leave = leave.data();
            leave.owner.get().then(owner => {
                owner = owner.data();
                owner.manager.get().then(manager => {
                    owner.manager = manager.data();
                    leave.owner = owner;
                    var Leave = {
                        "ToDTTM": moment(leave.to).format('MMM Do, YYYY'),
                        "FromDTTM": moment(leave.from).format('MMM Do'),
                        "Comments": leave.reason,
                        "Owner": {
                            "Name": leave.owner.name,
                            "Email": leave.owner.email,
                            "Manager": {
                                "Name": leave.owner.manager.name,
                                "Email": leave.owner.manager.email
                            }
                        },
                        "DuringThisTime": [],
                        "NoOfDays": (moment(leave.to).diff(moment(leave.from), 'days') + 1) + ' days'
                    }

                    console.log(Leave);

                    if (leave.isHalfDay) {
                        Leave.NoOfDays = "half day"
                    } else {
                        var noof = (moment(leave.to).diff(moment(leave.from), 'days') + 1);
                        if (noof == 1) {
                            Leave.NoOfDays = "one day";
                        } else if (noof > 1) {
                            Leave.NoOfDays = noof + " days";
                        }
                    }

                    // console.log(moment1().weekdayCalc(leave.from, leave.to, [0, 1, 2, 3, 4, 5, 6]));

                    store.collection("eUsers").where("manager", "==", store.doc("eUsers/" + leave.owner.manager.email)).where("team", "==", leave.owner.team).get().then(userCollection => {
                        userCollection.docs.forEach((emp, empIndex, empItems) => {
                            var employee = emp.data();
                            if (leave.owner.email == employee.email) { console.log(Leave); return res.send(Leave); }
                            //console.log(employee.email + " --- " + leave.owner.email + " --- " + leave.owner.manager.email);
                            store.collection("eLeaves").where("owner", "==", emp.ref).where("to", ">=", leave.from).get().then(leavesResult => {
                                leavesResult.docs.forEach((otherLeave, index, items) => {
                                    //console.log(index + " --$$$$$$$$$$ " + items.length)
                                    otherLeave = otherLeave.data();
                                    if (otherLeave.from <= leave.to) {
                                        //console.log(otherLeave.from + " ---------" + leave.to);
                                        Leave.DuringThisTime.push(employee.name + " : " + moment(otherLeave.from).format('MMM Do') + " - " + moment(otherLeave.to).format('MMM Do, YYYY'))
                                    }
                                    if ((index == items.length - 1) && (empIndex == empItems.length - 1)) {
                                        console.log(Leave); return res.send(Leave);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }
        else {
            return res.status(404).send("Leave Doc not found");
        }
    })
}

function updateLeaveOTP(leaveId) {
    var leaveRef = store.doc("eLeaves/" + leaveId);
    var otp = crypto.randomBytes(64).toString('hex');
    leaveRef.update({ "otp": otp });
    return otp;
}

module.exports.getLeaveByID = (req, res, next) => {

    if (!req.query.leaveId) {
        return res.status(404).send("Leave ID can't be empty")
    }

    store.collection('eLeaves').doc(req.query.leaveId).get().then(leave => {
        if (leave.exists) {
            leave = leave.data();
            leave.otp = updateLeaveOTP(req.query.leaveId);
            // console.log(leave.otp);
            leave.owner.get().then(owner => {
                owner = owner.data();
                owner.manager.get().then(manager => {
                    owner.manager = manager.data();
                    leave.owner = owner;
                    var Leave = {
                        "ToDTTM": moment(leave.to).tz('Asia/Kolkata').format('MMM Do, YYYY'),
                        "FromDTTM": moment(leave.from).tz('Asia/Kolkata').format('MMM Do'),
                        "Comments": leave.reason,
                        "Owner": {
                            "Name": leave.owner.name,
                            "Email": leave.owner.email,
                            "Manager": {
                                "Name": leave.owner.manager.name,
                                "Email": leave.owner.manager.email
                            }
                        },
                        "DuringThisTime": [],
                        "NoOfDays": '',
                        "APPROVE_URL": leave.otp,
                        "DECLINE_URL": leave.otp
                    }
                    
                    Leave.APPROVE_URL = process.env.API_BASE_URL + "/leave/" + req.query.leaveId  + "/status/approve/otp/" + leave.otp;
                    Leave.DECLINE_URL = process.env.API_BASE_URL + "/leave/" + req.query.leaveId  + "/status/decline/otp/" + leave.otp;

                    console.log(Leave);

                    switch (leave.status) {
                        case 0: {
                            Leave.Comments = leave.reason || "Not Provided";
                            break;
                        }
                        case 1: {
                            Leave.Comments = leave.managerComments || "Not Provided";
                            break;
                        }
                        case 2: {
                            Leave.Comments = leave.managerComments || "Not Provided";
                            break;
                        }
                        case 3: {
                            Leave.Comments = leave.cancellationComments || "Not Provided";
                            break;
                        }
                        default: Leave.Comments = "Not Provided"; break;
                    }

                    if (leave.isHalfDay) {
                        Leave.NoOfDays = "half day"
                    }
                    // else {
                    //     var noof = (moment(leave.to).diff(moment(leave.from), 'days') + 1);
                    //     if (noof == 1) {
                    //         Leave.NoOfDays = "one day";
                    //     } else if (noof > 1) {
                    //         Leave.NoOfDays = noof + " days";
                    //     }
                    // }

                    store.collection("eUsers").where("manager", "==", store.doc("eUsers/" + leave.owner.manager.email)).where("team", "==", leave.owner.team).get().then(userCollection => {
                        userCollection.docs.forEach((emp, empIndex, empItems) => {
                            var employee = emp.data();
                            if (leave.owner.email == employee.email) { req.Leave = Leave; next(); }
                            // console.log(employee.email + " --- " + leave.owner.email + " --- " + leave.owner.manager.email);
                            store.collection("eLeaves").where("owner", "==", emp.ref).where("to", ">=", leave.from).get().then(leavesResult => {
                                leavesResult.docs.forEach((otherLeave, index, items) => {
                                    //console.log(index + " --$$$$$$$$$$ " + items.length)
                                    otherLeave = otherLeave.data();
                                    if (otherLeave.from <= leave.to) {
                                        //console.log(otherLeave.from + " ---------" + leave.to);
                                        Leave.DuringThisTime.push(employee.name + " : " + moment(otherLeave.from).format('MMM Do') + " - " + moment(otherLeave.to).format('MMM Do, YYYY'))
                                    }
                                    if ((index == items.length - 1) && (empIndex == empItems.length - 1)) {
                                        req.Leave = Leave;
                                        next();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }
        else {
            return res.status(404).send("Leave Doc not found");
        }
    })
}
