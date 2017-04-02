module.exports = function(app){

  app.get('/whatever', function(req, res){
    console.log(req.url);
    res.render('whatever');
  });

};
