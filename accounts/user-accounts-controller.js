var moment = require('moment');
var admin = require('firebase-admin');
var auth = admin.auth();

module.exports.getListOfUsers = (req, res) => {
    if (!req.listOfUsers) {
        req.listOfUsers = []
    }
    auth.listUsers(1000, req.pageToken).then(listUsersResult => {
        listUsersResult.users.forEach(userRecord => {
            req.listOfUsers.push(userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
            req.pageToken = listUsersResult.pageToken;
            this.getListOfUsers(req, res);
        } else {
            return res.send({
                total: req.listOfUsers.length,
                users: req.listOfUsers
            })
        }
    }).catch(err => { console.log(err); return res.status(500).send(err.toJSON()) });
}

module.exports.getUser = (req, res) => {
    var key = req.params.key;
    var val = req.params.value;

    switch (key) {
        case 'email': {
            auth.getUserByEmail(val).then(user => res.send(user.toJSON())).catch(err => res.status(500).send(err.toJSON()));
            break;
        }
        case 'phone': {
            auth.getUserByPhoneNumber(val).then(user => res.send(user.toJSON())).catch(err => res.status(500).send(err.toJSON()));
            break;
        }
        case 'uid': {
            auth.getUser(val).then(user => res.send(user.toJSON())).catch(err => res.status(500).send(err.toJSON()));
            break;
        }
        default: {
            res.status(500).send("Invalid key");
            break;
        }
    }
}

module.exports.createUsers = (req, res) => {
    var users = req.body;
    var createdUsers = [];
    users.forEach((user, i, arr) => {
        admin.auth().createUser(user)
            .then(result => {
                createdUsers.push(result);
                if (i == arr.length - 1) {
                    res.send(createdUsers);
                }
            })
            .catch(err => {
                res.status(500).send(err.toJSON())
            });
    });
}

module.exports.updateUsers = (req, res) => {
    var users = req.body;
    var updatedUsers = [];
    users.forEach((user, i, arr) => {
        admin.auth().updateUser(user.uid, user)
            .then(result => {
                updatedUsers.push(result);
                if (i == arr.length - 1) {
                    res.send(updatedUsers);
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err.toJSON())
            });
    });
}

module.exports.deleteUsers = (req, res) => {
    var userUids = req.body;
    userUids.forEach(uid => {
        admin.auth().deleteUser(uid)
            .then(() => {
                res.send("Success");
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err.toJSON())
            });
    });
}