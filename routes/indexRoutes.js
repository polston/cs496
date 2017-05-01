module.exports = function(app){

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
    app.get('/studentUser', function(req, res){
    // console.log(req.url);
    res.render('../views/studentUser');
  });

};
