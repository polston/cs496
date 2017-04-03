module.exports = function(app){

  // index controller
  app.get('/public/js/indexController.js', function(req, res){
    res.sendFile('public/js/indexController.js', {'root': './'})
  });

};
