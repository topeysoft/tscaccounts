// ./models/user.js

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
//var Roles =  require('../models/api-roles');
var UserSchema = new Schema({
    email: { type: String, unique: true },
    first_name: String,
    middle_name:String,
    last_name: String,
    phone_number: Number,
    age: Number,
    gender: String,
    profession: String,
    organization: String,
    height: String,
    is_email_verified: Boolean,
    //role_id: { type : String, default: Roles.REGISTERED_USER },
    role: {},
    passwordHash: String,
    passwordSalt: { type: String, default: uuid.v4 },
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
 
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');