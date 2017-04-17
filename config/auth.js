const secrets = require('./authsecrets')

module.exports = {
    
    'googleAuth' : {
        'clientID'      : secrets.googleAuth.clientID,
        'clientSecret'  : secrets.googleAuth.clientSecret,
        'callbackURL'   : secrets.googleAuth.callbackURL
    }
};