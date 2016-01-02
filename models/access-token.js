var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    config = require('../config/config'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var exp = 3600;
try {
    exp = config.jwt_options.expiresIn;
} catch (e) { }

var TokenSchema = new Schema({
    user_email: String,
    access_token: String,
    expires_in: { type: Number, default: exp },
   // key: { type: String, default: uuid.v4 },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() }
    //role: {type :String, default:Roles.SUBSCRIBER},
    //passwordHash: String,
    //passwordSalt:  { type: String, default: uuid.v4 }
});



mongoose.model('Token', TokenSchema);
module.exports = mongoose.model('Token');