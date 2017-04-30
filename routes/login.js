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

// let strategy = ''
  
if(process.env.TEST == 'true'){
  // Home Page Route    
  app.get('/login', function(req, res){
    console.log('\nget /login : ' + JSON.stringify(req.user) + '\n');
    console.log('\nget /loing : ' + JSON.stringify(res.user) + '\n');
    res.render('../views/login');
  });

  app.post('/login', function(req, res, next){
    console.log('post login')
    console.log('req.body: ' + JSON.stringify(req.body, null, 2))
    let user = { _id: req.body._id, password: req.body.password }
    passport.authenticate('local', function(err, user, info){
      console.log('info: ' + JSON.stringify(info))
      console.log('auth req: ' + JSON.stringify(req.body))
      if(err){
        console.log('passport err: ' + err)
      }
      if(!user) {
        console.log('no user?')
        console.log(user)
        return res.redirect('/login')
      }
      req.logIn(user, function(err){
        if(err){
          console.log('login err?: ' + err)
          return next(err)
        }
        return res.redirect('/home')
      })
    })(req, res, next)
    // function(req, res) {
    //   console.log('req /login: ' + req)
    //   console.log('res /login: ' + res)
    //   res.redirect('/home')
    // }

  // }
    
  });

  // app.post('/login',
  //   passport.authenticate('local', { failureRedirect: '/login' }),
  //   function(req, res) {
  //     console.log('req /login: ' + req)
  //     console.log('res /login: ' + res)
  //     res.redirect('/home')
  //   }
  // );
}
else{
  // strategy = 'google'
  // GET /auth/google
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Google authentication will involve redirecting
  //   the user to google.com.  After authorization, Google will redirect the user
  //   back to this application at /auth/google/callback
  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile','email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    function(req, res) {
      console.log('\n\n get /auth/google/callback/ \n\nreq:' + JSON.stringify(req.body) + '\n\nres: ' + JSON.stringify(res.body) + '\n')
        res.redirect('/home');
    });
  };

}

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback
// app.get('/auth/google', 
//   passport.authenticate('google', { scope: ['profile','email'] })
// );

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

// app.get('/auth/google/callback',
//   passport.authenticate('google', {failureRedirect: '/'}),
//   function(req, res) {
//     console.log('\n\n get /auth/google/callback/ \n\nreq:' + JSON.stringify(req.body) + '\n\nres: ' + JSON.stringify(res.body) + '\n')
//       res.redirect('/home');
//   });
// };


function isLoggedIn(req, res, next) {
  // if(process.env.TEST == 'true'){
    // req.session.passport = 
    console.log('logged in req.header: ' + JSON.stringify(req.user, null, 2))
    console.log('logged in res.session: ' + JSON.stringify(res.user, null, 2))
    console.log('req.isAuthenticated(): ' + req.isAuthenticated())
  // }
  // if user is authenticated in the session, carry on
  console.log('\n\n isLoggedIn \n\nreq.header:' + JSON.stringify(req.heeader) + '\n\nres.header: ' + JSON.stringify(req.header) + '\n')
  console.log('req.session: ' + JSON.stringify(req.session, null, 2))
  if (req.isAuthenticated()){
    console.log('\n\nauthenticated: ' + JSON.stringify(req.body))
    return next();
  }
  
  // if they aren't redirect them to the home page
  res.redirect('/');
}
