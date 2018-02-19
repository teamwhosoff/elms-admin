const path = require('path');

module.exports = (req, res, next) => {
    res.render(path.join(__dirname + "/home.jade"));
}