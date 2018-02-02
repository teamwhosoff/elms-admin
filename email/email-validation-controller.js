'use strict';

module.exports.validate = (req, res, next) => {

    const leave = req.Leave;

    if (!leave) {
        return res.status(500).send("Leave object is missing");
    }
    if (!leave.FromDTTM || !leave.ToDTTM) {
        return res.status(500).send("FromDTTM or ToDTTM of leave object is missing");
    }
    if (!leave.Comments) {
        return res.status(500).send("Comments of leave object is missing");
    }
    if (!leave.Owner || !leave.Owner.Name || !leave.Owner.Email) {
        return res.status(500).send("Owner details in leave object is missing");
    }
    if (!leave.Owner.Manager || !leave.Owner.Manager.Name || !leave.Owner.Manager.Email) {
        return res.status(500).send("Manager details in leave owner object is missing");
    }
    next();
}