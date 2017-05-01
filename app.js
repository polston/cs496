let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
//dev environment backdoor so you don't have to keep signing in
//set it to 'false' when live
process.env.dev = require('./env.config')['process.env.dev']

//environment variable changes it to the testing db, when you're running tests
let dbconfig = require('./dbconfig')

mongoose.Promise = global.Promise

//depends on process.env.TEST, either 'true' or 'false'
mongoose.connect(dbconfig.db)
//mongoose.createConnection('mongodb://localhost/cs496')

//creates an express application
//mostly magic
let app = express();


//TODO: convert these into router middleware
let whateverRoutes = require('./routes/whateverRoutes');
let errorRoutes = require('./routes/errorRoutes');
let controllerRoutes = require('./routes/controllerRoutes');
// let calendarRoutes = require('./routes/calendarRoutes');
let loginRoutes = require('./routes/login');
// let appointmentRoutes = require('./routes/appointmentsRoute');



//static files
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(require('express-session')({ 
    secret: 'I hate OAuth',
    resave: false,
    saveUninitialized: false
})); 

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) //this not being default behavior is a cruel joke
require('./config/passport')(passport);

//set up template engine
app.set('view engine', 'ejs');

//appends '/api/' to all of the api routes
// app.use(require('./routes/permissionsMiddleware'))
app.use('/api/', require('./routes/apiRoutes'))
app.use('/index', require('./routes/indexRoutes'))
app.use('/calendar', require('./routes/calendarRoutes'))
app.use('/appointments', require('./routes/appointmentRoutes'))
//node modules path for normal cdn stuff
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'))
app.use('/bower_components', express.static(__dirname + '/bower_components/'))



//fire routes
//TODO: convert to router middleware
controllerRoutes(app);
loginRoutes(app,passport);
whateverRoutes(app);
errorRoutes(app);



//listen to port 4000
//process.env.PORT, process.env.IP
if(!module.parent){ 
    app.listen(process.env.PORT || 4000, process.env.IP || 'localhost');
}


console.log('process.env.dev: ' + process.env.dev)
console.log('Server starting at ' + (process.env.IP || 'localhost') + ':' + (4000 || process.env.PORT ) + ', probably.' );

//export for testing suites and stuff
module.exports = app