var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var userRoutes = require('./routes/user');
var linkRoutes = require('./routes/link');

var config = require('./config');

var port = 3000;
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/', userRoutes);
app.use('/link', linkRoutes);

app.listen(port, function() {
  console.log('Sever was started');
});
