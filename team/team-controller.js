var admin = require('firebase-admin');
var store = admin.firestore();

module.exports.import = (req, res) => {
    var teams = req.body;
    var importedList = []
    teams.forEach((team, i, arr) => {
        store.collection('eTeam').doc(team.id).set(team).then(result => {
            importedList.push(result);
            if (i == arr.length - 1) {
                res.send(importedList);
            }
        }).catch(err => res.status(500).send(err))
    })
}

module.exports.export = (req, res) => {
    store.collection('eTeam').get().then(result => {
        var teams = [];
        result.docs.forEach((team, i, arr) => {
            teams.push(team.data());
            if(i == arr.length - 1){
                res.send(teams);
            }
        })
    }).catch(err => res.status(500).send(err))
}