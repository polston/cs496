module.exports = function(app){

  //pretend this was pulled from a database
  let people = [{name: 'Michael'},
              {name: 'David'},
              {name: 'Nathan'},
              {name: 'Austin'}];

  //there's definitely a better way to do '/' and '/index'
  app.get('/', function(req, res){
    console.log(req.url);
    res.render('index', {group: people});
  });
  
  app.get('/index', function(req, res){
    console.log(req.url);
    res.render('index', {group: people});
  });

};
