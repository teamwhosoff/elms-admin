var admin = require('firebase-admin');
var store = admin.firestore();
var crypto = require("crypto");
const moment = require('moment-timezone');

function getNewOTP(leaveId) {
    var otp = crypto.randomBytes(64).toString('hex');
    return otp;
}

module.exports = (req, res, next) => {

    var leaveId = req.params.leaveId;
    var otp = req.params.otp;
    var status = 0;
    
    var newOtp = crypto.randomBytes(64).toString('hex');

    switch (req.params.status) {
        case 'approve':
            status = 1
            break;
        case 'decline':
            status = 2
            break;
        default:
            next("Invalid status");
    }


    console.log(leaveId + " ---- " + status + " ----- " + otp);
    //, otp: getNewOTP(leaveId)
    store.doc('eLeaves/' + leaveId).update({ "status": status, "otp": newOtp, 'modifiedAt': new Date() }).then(result => {
        if (result != null) {
            store.doc('eLeaves/' + leaveId).get().then(leave => {
                leave = leave.data();
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

                        Leave.APPROVE_URL = process.env.API_BASE_URL + "/leave/" + req.query.leaveId + "/status/approve/otp/" + leave.otp;
                        Leave.DECLINE_URL = process.env.API_BASE_URL + "/leave/" + req.query.leaveId + "/status/decline/otp/" + leave.otp;

                        console.log(Leave);

                        switch (leave.status) {
                            case 0:
                                {
                                    Leave.Comments = leave.reason || "Not Provided";
                                    break;
                                }
                            case 1:
                                {
                                    Leave.Comments = leave.managerComments || "Not Provided";
                                    break;
                                }
                            case 2:
                                {
                                    Leave.Comments = leave.managerComments || "Not Provided";
                                    break;
                                }
                            case 3:
                                {
                                    Leave.Comments = leave.cancellationComments || "Not Provided";
                                    break;
                                }
                            default:
                                Leave.Comments = "Not Provided";
                                break;
                        }

                        if (leave.isHalfDay) {
                            Leave.NoOfDays = "half day"
                        }
                        
                        req.userInContext = { email: process.env.ADMIN_EMAIL };
                        req.Leave = Leave;
                        req.leaveStatus = status == 1 ? "approved" : "declined";


                        next();
                    })
                })

            })
        }
    })

}
