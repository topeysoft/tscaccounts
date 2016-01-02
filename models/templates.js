// ./models/user.js

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var TemplatesSchema = new Schema({

    name: {type:String, Require:true},
    content: { type: Array, Require: true },
    description:String
});



mongoose.model('Templates', TemplatesSchema);
module.exports = mongoose.model('Templates');