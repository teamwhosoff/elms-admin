'use strict';

module.exports.validate = (req, res, next) => {

    const leave = req.body;

    if (!leave) {
        next("Leave object is missing");
    }
    if (!leave.FromDTTM || !leave.ToDTTM) {
        next("FromDTTM or ToDTTM of leave object is missing");
    }
    if (!leave.Comments) {
        next("Comments of leave object is missing");
    }
    if (!leave.Owner || !leave.Owner.Name || !leave.Owner.Email) {
        next("Owner details in leave object is missing");
    }
    if (!leave.Owner.Manager || !leave.Owner.Manager.Name || !leave.Owner.Manager.Email) {
        next("Manager details in leave owner object is missing");
    }
    next();
}