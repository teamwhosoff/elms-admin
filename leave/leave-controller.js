var moment = require('moment');
var admin = require('firebase-admin');
var store = admin.firestore();

module.exports = (req, res, next) => {

    if (!req.params.leaveId) {
        return res.status(404).send("Leave ID can't be empty")
    }

    store.collection('eLeaves').doc(req.params.leaveId).get().then(leave => {
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
                        "DuringThisTime": []
                    }
                    
                    store.collection("eUsers").where("manager", "==", store.doc("eUsers/" + leave.owner.manager.email)).where("team", "==", leave.owner.team).get().then(userCollection => {
                        userCollection.docs.forEach(emp => {
                            var employee = emp.data();
                            //if(leave.owner.email == employee.email) { return; }
                            console.log(employee.email + " --- " + leave.owner.email + " --- " + leave.owner.manager.email);
                            store.collection("eLeaves").where("owner", "==", emp.ref).where("to", ">=", leave.from).get().then(leavesResult => {
                                leavesResult.docs.forEach((otherLeave, index, items) => {
                                    otherLeave = otherLeave.data();
                                    if (otherLeave.from <= leave.to) {
                                        console.log(otherLeave.from + " ---------" + leave.to);
                                        Leave.DuringThisTime.push(employee.name + " : " + moment(otherLeave.from).format('MMM Do') + " - " + moment(otherLeave.to).format('MMM Do, YYYY'))
                                        if (index == items.length - 1) {
                                            return res.send(Leave);
                                        }
                                    }
                                    else if(index == items.length - 1){
                                        return res.send(Leave);
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
