var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var Promise = require('bluebird');
mongoose.Promise = Promise;

var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(methodOverride('_method'));

mongoose.connect('mongodb://v86k7s8580l5vh23:bgo1e63aq2a2ivhc4g179sapmf@ds349247.mlab.com:49247/heroku_07sljj11');
var db = mongoose.connection;

db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});

require('./controllers/apps_controller.js')(app);
