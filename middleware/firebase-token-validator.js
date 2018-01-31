var admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_CONFIG)
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
