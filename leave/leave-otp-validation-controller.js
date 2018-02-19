var admin = require('firebase-admin');
var store = admin.firestore();

module.exports = (req, res, next) => { 
    
    var leaveId = req.params.leaveId;
    var otp = req.params.otp;
    var status = 0;
    
    store.collection('eLeaves').doc(leaveId).get().then(leave => {
        if (leave.exists) {
            leave = leave.data();
            if(leave.otp == otp) {
                next();
            } 
            else {
                next("Invalid OTP");
            }
        }
    });
}