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

apiRoutes.post('/auth', function(req, res) {

  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if(!user) {
      res.json({ success: false, message: 'Authentication failed. User is not found'})
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password' })
      } else {
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 1440
        });
        res.json({
        success: true,
        message: 'Enjoy your token',
        token: token
        });
      }
    }
  });
});

apiRoutes.post('/registration', function(req, res) {

  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw  err;

    if (user) {
      res.json({
        success: false,
        message: 'Users is exist already'
      });
    } else if (!user) {
      var user = new User({
        name: req.body.name,
        password: req.body.password,
        admin: req.body.admin
      });

      user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true});
      });
    }
  });
});



apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate to token.'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      succes: false,
      message: 'No token provided'
    });
  }
});

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

apiRoutes.post('/create-link', function(req, res) {

})


app.use('/api', apiRoutes);
