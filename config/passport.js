var passport = require('passport');
var configAuth = require('./auth');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
var User       = require('../models/userModel');

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    //for the testing suite, because issuing a token to a dummy account is an exercise in futility
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
                })

        }))
    }
    //for actual users
    else{
        passport.use('google', new GoogleStrategy({ //we need to define a strategy to determine what we do when we get a token back from google

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,

        },
        function(accessToken, refreshToken, profile, done) {

            process.nextTick(function() {
                User.findOne({ 'google.id' : profile.id }, function(err, user) { //this looks to see if the user's google profile id is in the DB.
                //if it isn't then they are added to the DB. This can essentially be anything. This current setup literally anyone with a google account can access our app.
                //if we wanted to lock this down, we could do something like:  User.findOne({ 'google.email' : profile.emails[0].value }
                //that will find all users whose google.email property is equal to the email we got back from google. This would require that an email is known beforehand
                //by the product owner, and we would need to extend functionality in our user management page as well. 
                //if that email isn't found, we could do: res.redirect('/') to send them back to login and display an error message explaining why.
                    console.log('\n\nin passport.js :\n\nerror: ' + err + '\n\nuser: ' + user + '\n')
                    if (err){
                        return done(err, user);
                    }
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
                        newUser.google.token = accessToken; //?
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                        newUser.google.image = profile.photos[0].value
                      
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