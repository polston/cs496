let secrets = require('./authsecrets')

module.exports = {

    'googleAuth' : {
        'clientID'      : secrets.clientID,
        'clientSecret'  : secrets.clientSecret,
        'callbackURL'   : secrets.callbackURL
    }

};