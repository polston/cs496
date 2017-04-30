module.exports = function(app){
  //Line below this is needed for 401 errors in controllers.!! Don't delete!
  //res.status(401).render('../views/errors/401.ejs');

  //there's definitely a better way to do '/' and '/index'

  // app.get('/', function(req, res){
  //   console.log(req.url);
  //   res.render('../views/index');
  // });

  app.get('/', function(req, res){
    console.log(req.url);
    // res.sendFile(__dirname+ '/public/js/index.js')
    res.render('../views/landing');
  });
  
  app.get('/index', function(req, res){
    // console.log(req.url);
    res.render('../views/index');
  });

};
