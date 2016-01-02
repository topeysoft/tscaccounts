
var AccountController = function (session, mailer) {

    this.crypto = require('crypto');
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.UserProfileModel = require('../models/user-profile.js');
    this.userModel =  require('../models/users.js');
    this.tokenModel =  require('../models/access-token.js');
    this.session = session;
    this.mailer = mailer;
    this.security = require('../factory/security')
    this.MF = require('../factory/model-factory')
};

AccountController.prototype.getSession = function () {
    return this.session;
};

AccountController.prototype.setSession = function (session) {
    this.session = session;
};

AccountController.prototype.hashPassword = function(password, salt, callback) {
    var p = password+""; //new Buffer(password, 'binary');
    var s = salt+"";
    callback(this.crypto.createHmac('sha256', s).update(p).digest('hex'));
};

// function (password, salt, callback) {
//     // We use pbkdf2 to hash and iterate 10k times by default 
//     var iterations = 10000,
//         keyLen = 64; // 64 bit.
//     this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
// };

AccountController.prototype.logon = function(email, password, callback) {

    var me = this;

    me.userModel.findOne({ email: email }, function (err, user) {
        //console.log("ERR: "+err);
        // console.log("USER: ");
        // console.log(user);
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {

         var passwordHash =  me.hashPassword(password, user.passwordSalt, function (passwordHash) {
            //  console.log("password: ");
            //  console.log(password);
            //  console.log("passwordHash: ");
            //  console.log(passwordHash);
            //  console.log("user.passwordHash: ");
            //  console.log(user.passwordHash);
                if (passwordHash == user.passwordHash) {

                    var userProfileModel = new me.UserProfileModel({
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role:user.role
                    });

                    me.session.userProfileModel = userProfileModel;

                    return callback(err, new me.ApiResponse({
                        success: true, extras: {
                            userProfileModel:userProfileModel
                        }
                    }));
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_PWD } }));
                }
          });
        } else {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_NOT_FOUND } }));
        }

    });
};

AccountController.prototype.authenticate = function (email, password, callback) {

    var me = this;

    me.userModel.findOne({ email: { $regex: new RegExp("^" + email + '$', "i") } }, function (err, user) {
        //console.log("ERR: "+err);
        // console.log("USER: ");
        // console.log(user);
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {

            var passwordHash = me.hashPassword(password, user.passwordSalt, function (passwordHash) {
                
                if (passwordHash == user.passwordHash) {

                    me.MF.CreateFromUser(user, function (userProfileModel, created) {
                        //
                        console.log("Will now try to create token from USER PROFILE: ", userProfileModel);
                        if (created) {
                            // Try to create and save Token
                            var auth_time = new Date();
                            var tokenString = me.security.toToken({ user_profile: userProfileModel, auth_time: auth_time });
                            var data = { access_token: tokenString, updated_at: auth_time };
                            // Update user last login time
                            me.userModel.update({ email: email }, { last_login_time: auth_time }, function () { });
                            // check if token exists
                            var condition = { user_email: email };
                            me.tokenModel.findOneAndUpdate(condition, { access_token: tokenString },  function (err, token) {
                                if (!err && token !== undefined) {
                                    console.log("TOKEN Exists,and updated with: ", token);
                                    //me.tokenModel.update(condition, { access_token: tokenString }, 
                                    //    function (err, updatedToken) {
                                    //    if (!err) {
                                    //        console.log("Successfully updated token with: ", updatedToken);
                                            return callback(err, new me.ApiResponse({
                                                success: true, extras: {
                                                    access_token: token.access_token,
                                                    expires_in: token.expires_in
                                                }
                                          }));
                                        //} else {
                                        //    console.error("ERROR While trying to update token", err);
                                        //    return callback(err, new me.ApiResponse({
                                        //        success: false, extras: { msg: me.ApiMessages.COULD_NOT_SAVE_TOKEN }
                                        //    }));
                                        //}
                                    //});
                                } else {
                                    var tm = new me.tokenModel({ user_email: user.email, access_token: tokenString });
                                    console.log("TOKEN does not exists, will create with: ", tm);
                                    tm.save(condition, { access_token: tokenString }, 
                                        function (err, createdToken) {
                                        if (!err) {
                                            console.log("Successfully created token as: ", createdToken);
                                            return callback(err, new me.ApiResponse({
                                                success: true, extras: {
                                                    access_token: createdToken.access_token,
                                                    expires_in: createdToken.expires_in
                                                }
                                            }));
                                        } else {
                                            console.error("ERROR While trying to create token", err);
                                        }
                                    });
                                }
                            })
                            //var token = new me.tokenModel({ user_email: user.email, access_token: tokenString });
                            //token.save(function (err, sToken, numberAffected) {
                                
                            //    if (err) {
                            //        return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                            //    }
                                
                            //    if (numberAffected === 1) {
                                    
                                    
                            //        return callback(err, new me.ApiResponse({
                            //            success: true, extras: {
                            //                access_token: sToken.access_token,
                            //                expires_in: sToken.expires_in
                            //            }
                            //        }));
                            //    } else {
                            //        return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_SAVE_TOKEN } }));
                            //    }

                            //});
                        } else {
                            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.UNKOWN_ERROR } }));
                        }
                   
                        //me.userModel.update({ email: email }, data, 
                        //function (err, numberAffected) {

                        //    if (err) {
                        //        return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                        //    }

                        //    if (numberAffected < 1) {

                        //        var token = new me.tokenModel({ user_email: user.email, access_token: tokenString });
                        //        token.save(function (err, sToken, numberAffected) {

                        //            if (err) {
                        //                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                        //            }

                        //            if (numberAffected === 1) {


                        //                return callback(err, new me.ApiResponse({
                        //                    success: true, extras: {
                        //                        access_token: sToken.access_token,
                        //                        expires_in: sToken.expires_in
                        //                    }
                        //                }));
                        //            } else {
                        //                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_SAVE_TOKEN } }));
                        //            }

                        //        });
                        //    } else {
                        //            var uToken = data;
                        //            console.log(data);
                        //        return callback(err, new me.ApiResponse({
                        //            success: true, extras: {
                        //                access_token: uToken.access_token,
                        //                expires_in: uToken.expires_in
                        //            }
                        //        }));
                        //    }
                        //});
                    });
                    
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_PWD } }));
                }
            });
        } else {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_NOT_FOUND } }));
        }

    });
};


AccountController.prototype.logoff = function () {
    if (this.session.userProfileModel) delete this.session.userProfileModel;
    return;
};

AccountController.prototype.register = function (newUser, password, callback) {
    var me = this;
    me.userModel.findOne({ email: newUser.email }, function (err, user) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_ALREADY_EXISTS } }));
        } else {
           // newUser.setPassword(newUser.password);
           me.hashPassword(password, newUser.passwordSalt, function (passwordHash) {
               newUser.passwordHash=passwordHash;
           });
            newUser.save(function (err, user, numberAffected) {

                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }
                    
                if (numberAffected === 1) {

                    var userProfileModel = new me.UserProfileModel({
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role:user.role
                    });

                    return callback(err, new me.ApiResponse({
                        success: true, extras: {
                            userProfileModel: userProfileModel
                        }
                    }));
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USER } }));
                }             

            });
        }

    });
};

AccountController.prototype.resetPassword = function (email, callback) {
    var me = this;
    me.userModel.findOne({ email: email }, function (err, user) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {
            // Save the user's email and a password reset hash in session. We will use
            var passwordResetHash = me.uuid.v4();
            me.session.passwordResetHash = passwordResetHash;
            me.session.emailWhoRequestedPasswordReset = email;

            me.mailer.sendPasswordResetHash(email, passwordResetHash);

            return callback(err, new me.ApiResponse({ success: true, extras: { passwordResetHash: passwordResetHash } }));
        } else {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_NOT_FOUND } }));
        }        
    })
};

AccountController.prototype.resetPasswordFinal = function (email, newPassword, passwordResetHash, callback) {
    var me = this;
    if (!me.session || !me.session.passwordResetHash) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EXPIRED } }));
    }

    if (me.session.passwordResetHash !== passwordResetHash) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH } }));
    }

    if (me.session.emailWhoRequestedPasswordReset !== email) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH } }));
    }

    var passwordSalt = this.uuid.v4();

    me.hashPassword(newPassword, passwordSalt, function (passwordHash) {
       
        me.userModel.update({ email: email }, { passwordHash: passwordHash, passwordSalt: passwordSalt }, function (err, numberAffected, raw) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (numberAffected < 1) {

                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD } }));
            } else {
                return callback(err, new me.ApiResponse({ success: true, extras: null }));
            }                
        });
   });
};



module.exports = AccountController;