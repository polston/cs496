//includes the express module
let express = require('express');
let mongoose = require('mongoose')
let bodyParseer = require('body-parser')

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/cs496')

//includes the routes, probably a way to just batch include all of them
//but, I don't know how (yet)
let indexRoutes = require('./routes/index');
let whateverRoutes = require('./routes/whatever');
let errorRoutes = require('./routes/error');
let controllerRoutes = require('./routes/controllers')

//creates an express application
//mostly magic
let app = express();

//static files
app.use(express.static(__dirname + '/public'));

app.use(bodyParseer.json())

//set up template engine
app.set('view engine', 'ejs');
//app.set('view engine', 'html')



app.use('/api/', require('./routes/api'))
//app.use('/controllers/', require('./public/js'))

// app.use(express.static('./public/js'));

//node modules path for normal cdn stuff
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'))

//fire routes
controllerRoutes(app)
indexRoutes(app);
whateverRoutes(app);
errorRoutes(app);


//listen to port 3000
//process.env.PORT, process.env.IP
if(!module.parent){ app.listen(process.env.PORT || 4000, process.env.IP || 'localhost'); }

console.log('listening to port 4000');
