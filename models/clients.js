// ./models/user.js

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var Roles =  require('../models/api-roles');
var ClientSchema = new Schema({
    client_id: String,
    description: String,
    created_date: { type: Date, default:new Date() },
    modified_date: { type: Date, default: new Date() },
    created_by_id: String,
    private_key_salt: { type: String, default: uuid.v4 },
    private_key: String,
    last_login_time:Date,
    meta:[Schema.Types.Mixed]
}, {strict:true});





 
var hash = function(password, salt, callback) {
    var p = password+""; //new Buffer(password, 'binary');
    var s = salt+"";
    callback(crypto.createHmac('sha256', s).update(p).digest('hex'));
    
};
 
// UserSchema.methods.setPassword = function(passwordString) {
//     var me = this;
//     hash(passwordString, me.passwordSalt, function(p){
//         me.passwordHash = p;
//     });
// };
 
// UserSchema.methods.isValidPassword = function(passwordString) {
//     return this.passwordHash === hash(passwordString, this.passwordSalt);
// };
 
mongoose.model('Client', ClientSchema);
module.exports = mongoose.model('Client');