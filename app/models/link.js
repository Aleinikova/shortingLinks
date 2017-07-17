const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Link = new Schema({
  originalLink: String,
  shortLink: String,
  author: String,
  count: {type: Number, default: 0},
  tags: {type: Array, default: []}
});

Link.pre('save', function(next) {
  this.constructor.find({
    originalLink: this.originalLink,
  })
    .then(links => {
      var shortLinks = links.map(link => link.shortLink);

      var newShortLink = generateShortLink(4);

      while (shortLinks.indexOf(newShortLink) > -1) {
        newShortLink = generateShortLink(4);
      }

      this.shortLink = newShortLink;

      next();
    });
});

function generateShortLink(n) {
  var abc ='abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789';
  var abcLength = abc.length;
  var genLink ='lera.com/';
  var linkLength = n + genLink.length;

  while(genLink.length < linkLength) {
    var index = Math.floor ( Math.random() * abcLength );
    genLink += abc[index];
  }

  return genLink;
}

module.exports = mongoose.model('Link', Link);
