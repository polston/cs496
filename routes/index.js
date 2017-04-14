module.exports = function(app){

  //there's definitely a better way to do '/' and '/index'
  app.get('/', function(req, res){
    console.log(req.url);
    res.sendFile(__dirname+ '/public/js/indexController.js')
    res.render('../views/index');
  });
  
  app.get('/index', function(req, res){
    console.log(req.url);
    res.location('../views/indexController.js');
  });

};
