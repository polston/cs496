module.exports = function(app){

  // index controller
  app.get('/public/js/index.js', function(req, res){
    res.sendFile('public/js/index.js', {'root': './'})
  });

};
