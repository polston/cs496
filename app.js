let express = require('express');
let mongoose = require('mongoose')
let bodyParseer = require('body-parser')

//environment variable changes it to the testing db, when you're running tests
let dbconfig = require('./dbconfig')

mongoose.Promise = global.Promise

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

//set up template engine
app.set('view engine', 'ejs');

//appends '/api/' to all of the api routes
app.use('/api/', require('./routes/apiRoutes'))

//node modules path for normal cdn stuff
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'))

//fire routes
controllerRoutes(app)
indexRoutes(app)
calendarRoutes(app)
whateverRoutes(app)
errorRoutes(app)


//listen to port 3000
//process.env.PORT, process.env.IP
if(!module.parent){ 
    app.listen(process.env.PORT || 4000, process.env.IP || 'localhost');
}

console.log('Server starting at ' + (process.env.IP || 'localhost') + ':' + (process.env.PORT || 4000) + ', probably.' );

//export for testing suites and stuff
module.exports = app