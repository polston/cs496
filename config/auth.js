const secrets = require('./authsecrets')
//imports values necessary for google authentication from authsecrets file
//That file is in our .gitignore to prevent it becoming public
module.exports = {
    'googleAuth' : {
        'clientID'      : secrets.googleAuth.clientID,
        'clientSecret'  : secrets.googleAuth.clientSecret,
        'callbackURL'   : secrets.googleAuth.callbackURL
    }
};