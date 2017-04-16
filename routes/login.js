module.exports = function(app, passport){


// Home Page Route    
  app.get('/', function(req, res){
    console.log('\nget / : ' + JSON.stringify(req.body) + '\n');
    res.render('../views/landing');
  });
  
app.get('/home', isLoggedIn, function(req, res) {
  console.log('\nget /home' + JSON.stringify(req.body) + '\n') 
    res.render('../views/home', {
        user : req.body // get the user out of session and pass to template
    });
});
    
    
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile','email'] })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

app.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  function(req, res) {
    console.log('\n get /auth/google/callback/ \nreq:' + JSON.stringify(req.body) + '\nres: ' + JSON.stringify(res.body) + '\n')
      res.redirect('/home');
  });
};


function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
      console.log('\nauthenticated: ' + JSON.stringify(req.body))
      return next();
    }
    
    // if they aren't redirect them to the home page
    res.redirect('/');
}
