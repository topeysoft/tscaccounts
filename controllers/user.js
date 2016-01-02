var UserController = function (session, mailer) {

    this.crypto = require('crypto');
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.UserProfileModel = require('../models/user-profile.js');
    this.userModel = require('../models/users.js');
    this.session = session;
    this.mailer = mailer;
    //this.UserFactory = require('../factory/user-factory.js');
    this.ModelFactory = require('../factory/model-factory.js');
};


//var populateUserProfile = function (user) {
//    var userProfileModel = new me.UserProfileModel({
//        email: user.email,
//        first_name: user.first_name,
//        last_name: user.last_name,
//        role: user.role
//    });
//};

//var populateUserProfilesFromArray = function (userArray) {
//    var userProfileArray = [];
//    for (var i = 0, len = userArray.length; i < len; i++) {
//        userProfileArray.push(populateUserProfile(userArray[i]));
//    }

//    return userProfileArray;
//};

UserController.prototype.GetAll = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.userModel.find(params, function (err, users) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (users && users.length > 0) {
            return me.ModelFactory.CreateFromUserArray(users, function (userProfileArray) {
              return  callback(err, new me.ApiResponse({ success: true, extras: userProfileArray }));
            });
            
        } else {
          return  callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

UserController.prototype.GetByEmail = function (email, callback) {
    var me = this;
    me.userModel.findOne({ email: { $regex: new RegExp("^" + email+'$', "i") } }, function (err, user) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {
            return me.ModelFactory.CreateFromUser(user, function (userProfile) {
                return callback(err, new me.ApiResponse({ success: true, extras: userProfile }));
            });
        } else {
           return callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

UserController.prototype.GetById = function (id, callback) {
    var me = this;
    me.userModel.findOne({ _id: id }, function (err, user) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {
            return me.ModelFactory.CreateFromUser(user, function (userProfile) {
                return callback(err, new me.ApiResponse({ success: true, extras: userProfile }));
            });
        } else {
           return callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

UserController.prototype.UpdateUser = function (id, newUser, callback) {
    var me = this;
    //console.log(newUser);
    if (id != newUser.id) {
        console.log(newUser.id);
        console.log(id);
        console.log(newUser);
        
        return callback('', new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_OPERATION } }));
    }
    me.userModel.update({ _id: id }, newUser,

    function  (err, numAffected) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (numAffected >0) {
            callback(err, new me.ApiResponse({ success: true, extras: me.ApiMessages.UPDATED }));
        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}
// Must be called last the his file
module.exports = UserController;