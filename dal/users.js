
var User = function () {
    
    this.crypto = require('crypto');
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response');
    this.ApiMessages = require('../models/api-messages');
    this.Model = require('../models/users');
    this.LINQ = require('node-linq').LINQ;
    this.mongoose = require('mongoose');
    
    this.ModelFactory = require('../factory/model-factory');
};


// User
User.prototype.GetMany = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Model.find(params, function (err, items) {
        if (err) {
          //  console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                
             
        }
        
        if (items && items.length > 0) {
            
            var itemData = me.ModelFactory.CreateFromUserArray(items);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
            

        } else {
            console.log("There was no User found for this query" + params);
            return  callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
            
        }

    });
}

User.prototype.GetOne = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Model.findOne(params, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemData = me.ModelFactory.CreateFromUserArray(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            
            // console.log("No Users found by by the name " + name);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }


    });
}
User.prototype.GetByName = function (name, callback) {
    var me = this;
    me.Model.findOne({ name: { $regex: new RegExp("^" + name + '$', "i") } }, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemData = me.ModelFactory.CreateFromUserArray(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            
            console.log("No Users found by by the name " + name);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}


User.prototype.GetById = function (id, callback) {
    var me = this;
    me.Model.findOne({ _id: id }, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemData = me.ModelFactory.CreateFromUserArray(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            
            console.log("No item found by  the id " + id);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

User.prototype.Update = function (email, newItem, callback) {
    var me = this;
    if (typeof (newItem) == "string") newItem = JSON.parse(newItem);
    //console.log(newUser);
    //if (id != newItem.id) {
    //    return callback('', new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_OPERATION } }));
    //}
    
    me.Model.findOneAndUpdate({ $or: [{ _id: email }, { email: email }] }, newItem,

    function (err, updatedItem) {
        if (err) {
            console.error(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (updatedItem) {
            var itemData = me.ModelFactory.CreateFromUserArray(updatedItem);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));

                   } else {
            console.log("Could not update User");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}

User.prototype.Delete = function (id, callback) {
    var me = this;
    
    me.Model.findOneAndRemove({ _id: id },

    function (err, removedItem) {
        if (err) {
            console.error(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (removedItem) {
            var itemData = me.ModelFactory.CreateFromUserArray(removedItem);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            console.log("Could not delete item");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}
User.prototype.Create = function (r, callback) {
    var me = this;
    if (typeof (r) == "string") r = JSON.parse(r);
    var newItem = new me.Model(r);
    me.Model.findOne({ email: newItem.email }, function (err, item) {
        
        if (err) {
            if (err) {
                console.log(err);
            }
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.ALREADY_EXISTS } }));
        } else {
            
            newItem.save(function (err, item, numberAffected) {
                
                if (err) {
                    console.log(err);
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }
                
                if (numberAffected === 1) {
                    
                    var itemData = me.ModelFactory.CreateFromUserArray(newItem);
                    callback(err, new me.ApiResponse({ success: true, extras: itemData }));

                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE } }));
                }

            });
        }

    });
}

// Must be called last the his file
module.exports = User;
