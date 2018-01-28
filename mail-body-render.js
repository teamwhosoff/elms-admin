var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;

module.exports.render = (templateName, leave, onError, onSuccess) => {

    var templateDir = path.join(__dirname, 'templates', templateName);
    var template = new EmailTemplate(templateDir);

    var leave = leave || {};

    template.render(leave, (err, result) => {
        if (err) {
            return onError(err);
        }
        return onSuccess(result.html);
    })
}