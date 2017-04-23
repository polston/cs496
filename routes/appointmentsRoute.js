module.exports = function(app){

  app.get('/', function(req, res){
    console.log(req.url);
    // res.sendFile(__dirname+ '/public/js/index.js')
    res.render('../views/landing');
  });
  
  app.get('/appointments', function(req, res){
    // console.log(req.url);
    res.render('../views/appointments');
  });

};
