var express = require('express');
var userRoutes = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config');

userRoutes.post('/auth', function(req, res) {

  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User is not found'})
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password' })
      } else {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 1440 * 60 * 60
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

userRoutes.post('/registration', function(req, res) {

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

userRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, config.secret, function(err, decoded) {
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

module.exports = userRoutes;
