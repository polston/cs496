let express = require('express');
let mongoose = require('mongoose');
let bodyParseer = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');


//environment variable changes it to the testing db, when you're running tests
let dbconfig = require('./dbconfig')

mongoose.Promise = global.Promise

<<<<<<< HEAD
//depends on process.env.TEST, either 'true' or 'false'
mongoose.connect(dbconfig.db)

//includes the routes, probably a way to just batch include all of them
//but, I don't know how (yet)
let indexRoutes = require('./routes/indexRoutes');
let whateverRoutes = require('./routes/whateverRoutes');
let errorRoutes = require('./routes/errorRoutes');
let controllerRoutes = require('./routes/controllerRoutes')
let calendarRoutes = require('./routes/calendarRoutes')

//creates an express application
//mostly magic
let app = express()

//static & public files
app.use(express.static(__dirname + '/public'))

//used to parse the 'body' of http requests into json
app.use(bodyParseer.json())
=======
mongoose.connect('mongodb://localhost/cs496')
//mongoose.createConnection('mongodb://localhost/cs496')

//creates an express application
//mostly magic
let app = express();

//includes the routes, probably a way to just batch include all of them
//but, I don't know how (yet)
let indexRoutes = require('./routes/index');
let whateverRoutes = require('./routes/whatever');
let errorRoutes = require('./routes/error');
let controllerRoutes = require('./routes/controllers');
let loginRoutes = require('./routes/login');



//static files
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(require('express-session')({ 
    secret: 'I hate OAuth',
    resave: false,
    saveUninitialized: false
})); 
app.use(passport.initialize());                                        //whatever you've done, we're not getting users anymore
app.use(passport.session());                                            //sec...well its redirecting now lol
require('./config/passport')(passport);
app.use(bodyParseer.json())                                             
>>>>>>> 9936d07... Added Google OAuth2 Sign-In

//set up template engine
app.set('view engine', 'ejs');

//appends '/api/' to all of the api routes
app.use('/api/', require('./routes/apiRoutes'))

//node modules path for normal cdn stuff
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'))

//fire routes
<<<<<<< HEAD
controllerRoutes(app)
indexRoutes(app)
calendarRoutes(app)
whateverRoutes(app)
errorRoutes(app)
=======
controllerRoutes(app);
loginRoutes(app,passport);
indexRoutes(app);
whateverRoutes(app);
errorRoutes(app);
>>>>>>> 9936d07... Added Google OAuth2 Sign-In


//listen to port 4000
//process.env.PORT, process.env.IP
if(!module.parent){ 
    app.listen(process.env.PORT || 4000, process.env.IP || 'localhost');
}

console.log('Server starting at ' + (process.env.IP || 'localhost') + ':' + (process.env.PORT || 4000) + ', probably.' );

//export for testing suites and stuff
module.exports = app