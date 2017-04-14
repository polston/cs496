module.exports = function(app){
  
  app.get('/calendar', function(req, res){
    console.log(req.url);
    res.sendFile(__dirname+ '/public/js/calendarController.js')
    res.location('../views/calendar');
  });

};
