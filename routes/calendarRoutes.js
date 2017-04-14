module.exports = function(app){
  
  app.get('/calendar', function(req, res){
    console.log(req.url);
    // res.sendFile('/public/js/calendarController.js')
    res.render('../views/calendar');
  });

};
