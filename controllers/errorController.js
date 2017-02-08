module.exports = function(app){

  // probably a better way than setting the path,
  // kind of screwy, because you have to change the relatative path
  // in the view
  app.use(function(req, res, next){
    console.log(req.url);
    res.status(404).render('errors/404');
  });

};