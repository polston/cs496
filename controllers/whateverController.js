module.exports = function(app){

  //there's definitely a better way to do '/' and '/index'
  app.get('/whatever', function(req, res){
    console.log(req.url);
    res.render('whatever');
  });

};
