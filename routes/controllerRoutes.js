module.exports = function(app){

  // index controller
  app.get('/public/js/indexController.js', function(req, res){
    res.sendFile('public/js/indexController.js', {'root': './'})
  });

  // index controller
  app.get('/public/js/calendarController.js', function(req, res){
    res.sendFile('public/js/calendarController.js', {'root': './'})
  });
  
  app.get('/public/js/appointmentsController.js', function(req, res){
    res.sendFile('public/js/appointmentsController.js', {'root': './'})
  });

};
