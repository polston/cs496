//includes the express module
let express = require('express');

//includes the controllers, probably a way to just batch include all of them
//but, I don't know how (yet)
let indexController = require('./controllers/indexController');
let errorController = require('./controllers/errorController');

//creates an express application
//mostly magic
let app = express();

//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

//node modules path for normal cdn stuff
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

//fire controllers
indexController(app);
errorController(app);

//listen to port 3000
app.listen(3000);
console.log('listening to port 3000');
