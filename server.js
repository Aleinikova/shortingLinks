var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

var port = 3000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.send('Hello ' + port);
})

app.get('/setup', function(req, res) {
  var admin = new User({
    name: 'admin',
    password: 'admin',
    admin: true
  });

  admin.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true});
  });
});
app.listen(port);

var apiRoutes = express.Router();
apiRoutes.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.json({ message: 'Welcome' });
  });
});

apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

app.use('/api', apiRoutes);
