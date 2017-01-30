let express = require('express');

let indexController = require('./controllers/indexController');
let errorController = require('./controllers/errorController');

let app = express();

//set up template engine
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));

//fire controllers
indexController(app);
errorController(app);

//listen to port
app.listen(3000);
console.log('listening to port 3000');
