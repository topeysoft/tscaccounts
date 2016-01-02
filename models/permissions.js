// ./models/user.js

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
//var Perms =  require('../models/api-permissions');
var PermSchema = new Schema({
    id:String,
    uuid: { type: String, default: uuid.v4 },
    name: { type: String, unique: true },
    description:String
});



mongoose.model('Permission', PermSchema);
module.exports = mongoose.model('Permission');