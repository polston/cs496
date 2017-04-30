var passport = require('passport');
var configAuth = require('./auth');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
var User       = require('../models/userModel');

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        // console.log('\n\n---------------------serialized user: ', user)
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            // console.log('\n\n--------------------id: ', id, '\n---------------user: \n', user)
            done(err, user);
        });
    });

    if(process.env.TEST == 'true'){
        passport.use('local', new LocalStrategy({
            usernameField: '_id',
            passwordField: 'password',
            // session: true,
            passReqToCallback: true
            },
            function(req, id, password, done) {
                // console.log('\n\nreq: ' + req + '\n\nid:' + id + ' \n\npassword: '+ password)
                process.nextTick(function(){
                    User.findById(id, function (err, user) {
                        if (err) { return done(err); }
                        if (!user) {
                            return done(null, false, { message: 'Invalid user._id.' });
                        }
                        // if (!user.validPassword(password)) {
                        //     return done(null, false, { message: 'Incorrect password.' });
                        // }
                        if (!user.dummyPasswordChecker()) {
                            return done(null, false, { message: 'Incorrect password.' });
                        }
                        return done(null, user);
                    });
                }//)
            // }
    )}))
    }
    else{
        passport.use('google', new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,

        },
        
        
        // This is the strategy?
        // Yes.
        function(accessToken, refreshToken, profile, done) {
            
            console.log('accessToken: ' + accessToken + '\nrefreshToken: ' + refreshToken + '\nprofile: ' + JSON.stringify(profile))

            process.nextTick(function() {
                User.findOne({ 'google.id' : profile.id }, function(err, user) { //this is obviously always fail until we have someone in the database with a google.id
                    console.log('\n\nin passport.js :\n\nerror: ' + err + '\n\nuser: ' + user + '\n')
                    if (err){
                        return done(err, user);
                    }

                        //just seeing if his shit will actually work.
                    if (user) {
                        // if a user is found, log them in
                        console.log('profile: ' + profile)
                        return done(null, user); //so this is passed back into login.js? should be?
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();
                        newUser.name.firstName = profile.name.givenName
                        newUser.name.lastName =  profile.name.familyName
                        newUser.google.id    = profile.id; //w
                        newUser.google.token = accessToken; //?                                                                               //from google
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                    
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }    
                });
            });
        }));
    }
    
};