module.exports = (req, res, next) => {
    if (req.userInContext && req.userInContext.email != process.env.ADMIN_EMAIL) {
        return res.status(403).send("You are not admin...");
    }
    else {
        next();
    }
}
