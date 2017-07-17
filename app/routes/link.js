var linkRoutes = require('express').Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

var Link = require('../models/link');
var User = require('../models/user');

linkRoutes.post('/create', function(req, res) {

  var link = new Link({
    originalLink: req.body.link,
    count: req.body.count,
  });

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          message: 'token not provided'
        });
      } else {
        user = decoded._doc.name;
        link = Object.assign(link, {author: user})
        link.save(function(err) {
          if (err) throw err;
          console.log("Link was created", link);
          res.json({ success: true, message: link});
        })
      }
    })
  }
});

module.exports = linkRoutes;
