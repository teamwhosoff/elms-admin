var admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert({
        "project_id": "ee-lms",
        "private_key": process.env.FB_ADMIN_PRIVATE_KEY,
        "client_email": process.env.FB_ADMIN_CLIENT_EMAIL
    })
});

module.exports = (req, res, next) => {
    var idToken = req.headers['fb-user-token'];
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            if (decodedToken.uid) {
                console.log(decodedToken.uid);
                next();
            }
        }).catch(function(err) {
            next(err)
        });
}
