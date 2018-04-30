var admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert({
        "project_id": process.env.FB_ADMIN_PROJECT_ID,
        "private_key": process.env.FB_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.FB_ADMIN_CLIENT_EMAIL
    })
});

module.exports = (req, res, next) => {

//     return next();

    var idToken = req.headers['fb-user-token'];
    if (!idToken) {
        return res.status(403).send("fb-user-token header is missing");
    }
    // console.log(idToken);
    admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
            // console.log("Decoded Token: " + JSON.stringify(decodedToken));
            if (decodedToken) {
                req.userInContext = decodedToken;
                next();
            }
            else {
                return res.status(403).send("Invalid Decoded Token");
            }
        }).catch(function (err) {
            console.log(err);
            return res.status(403).send("Invalid Token");
        });
}
