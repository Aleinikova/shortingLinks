const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Link', new Schema({
  originalLink: String,
  shortLink: String,
  author: String,
  count: {type: Number, default: 0},
  tags: {type: Array, default: []}
}));
