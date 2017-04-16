module.exports = function(app){

  //there's definitely a better way to do '/' and '/index'
<<<<<<< HEAD:routes/indexRoutes.js
  app.get('/', function(req, res){
    console.log(req.url);
    res.render('../views/index');
  });
  
  app.get('/index', function(req, res){
    console.log(req.url);
    res.render('../views/index')
=======
  // app.get('/', function(req, res){
  //   console.log(req.url);
  //   // res.sendFile(__dirname+ '/public/js/index.js')
  //   res.render('../views/landing');
  // });
  
  app.get('/index', function(req, res){
    // console.log(req.url);
    res.render('../views/index');
>>>>>>> 9936d07... Added Google OAuth2 Sign-In:routes/index.js
  });

};
