var admin = require('firebase-admin');
var store = admin.firestore();

module.exports.import = (req, res) => {
    var users = req.body;
    var importedList = [];

    users.forEach((user, i, arr) => {

        // if (user.manager) {
        //     user.manager = store.doc("/eUsers/" + user.manager).ref;
        // }
        // if (user.team) {
        //     user.team = store.doc("/eTeam/" + user.team).ref;
        // }

        store.collection('eUsers').doc(user.email).set(user).then(result => {

            store.doc('/eUsers/' + user.email).update({ 
                team: store.doc("/eTeam/" + user.team).ref, 
                manager: store.doc("/eUsers/" + user.manager).ref 
            }).then(() => {
                console.log('updated references for ' + user.email);
            }).catch(err => { console.log('error while updating references for ' + user.email); console.log(err); })

            importedList.push(result);
            if (i == arr.length - 1) {
                res.send(importedList);
            }
        }).catch(err => res.status(500).send(err))
    })


}

module.exports.export = (req, res) => {
    store.collection('eUsers').get().then(result => {
        var users = [];
        result.docs.forEach((user, i, arr) => {
            var u = user.data();
            if (u.manager) { u.manager._firestore = undefined };
            if (u.team) { u.team._firestore = undefined }
            users.push(u);
            if (i == arr.length - 1) {
                res.send(users);
            }
        })
    }).catch(err => res.status(500).send(err))
}
