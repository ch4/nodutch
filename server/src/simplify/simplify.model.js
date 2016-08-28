/**
 * Created by hc on 8/27/16.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SimplifySchema = new Schema({
  user: String,
  cardToken: String
});

module.exports = mongoose.model('SimplifyUser', SimplifySchema);
