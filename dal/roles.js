
var Role = function () {
    
    this.crypto = require('crypto');
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response');
    this.ApiMessages = require('../models/api-messages');
    this.Model = require('../models/roles');
    this.LINQ = require('node-linq').LINQ;
    this.mongoose = require('mongoose');
    
    this.ModelFactory = require('../factory/model-factory');
};


// Role
Role.prototype.GetMany = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Model.find(params, function (err, items) {
        if (err) {
          //  console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                
             
        }
        
        if (items && items.length > 0) {
            
            var itemArray = me.ModelFactory.CreateFromRoleArray(items);
            callback(err, new me.ApiResponse({ success: true, extras: itemArray }));
                 
            
            

        } else {
            console.log("There was no role found for this query" + params);
            return  callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
            
        }

    });
}

Role.prototype.GetOne = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Model.findOne(params, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
           // var itemProfile = me.ModelFactory.CreateFromRole(item);
            var itemData = me.ModelFactory.CreateFromRole(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            
            // console.log("No roles found by by the name " + name);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }


    });
}
Role.prototype.GetByName = function (name, callback) {
    var me = this;
    me.Model.findOne({ name: { $regex: new RegExp("^" + name + '$', "i") } }, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemData = me.ModelFactory.CreateFromRole(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            
            console.log("No roles found by by the name " + name);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}


Role.prototype.GetById = function (id, callback) {
    var me = this;
    me.Model.findOne({ _id: id }, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemData = me.ModelFactory.CreateFromRole(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            
            console.log("No item found by  the id " + id);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

Role.prototype.Update = function (id, newItem, callback) {
    var me = this;
    if (typeof (newItem) == "string") newItem = JSON.parse(newItem);
    //console.log(newUser);
    if (id != newItem.id) {
        return callback('', new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_OPERATION } }));
    }
    
    me.Model.findOneAndUpdate({ _id: id }, newItem,

    function (err, updatedItem) {
        if (err) {
            console.error(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (updatedItem) {
            var itemData = me.ModelFactory.CreateFromRole(updatedItem);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
           // callback(err, new me.ApiResponse({ success: true, extras: { msg: me.ApiMessages.UPDATED, item: updatedItem } }));
        } else {
            console.log("Could not update role");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}

Role.prototype.Delete = function (id, callback) {
    var me = this;
    
    me.Model.findOneAndRemove({ _id: id },

    function (err, removedItem) {
        if (err) {
            console.error(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (removedItem) {
            //var item = ModelFactory.CreateFromRole(removedItem);
            //callback(err, new me.ApiResponse({ success: true, extras: { msg: me.ApiMessages.DELETED, item: item } }));
            var itemData = me.ModelFactory.CreateFromRole(removedItem);
            callback(err, new me.ApiResponse({ success: true, extras: itemData }));
        } else {
            console.log("Could not delete item");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}
Role.prototype.Create = function (r, callback) {
    var me = this;
    if (typeof (r) == "string") r = JSON.parse(r);
    var newItem = new me.Model(r);
    me.Model.findOne({ $and: [{ name: newItem.name }, { uri: newItem.uri }] }, function (err, item) {
        
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
                    var itemData = me.ModelFactory.CreateFromRole(item);
                    callback(err, new me.ApiResponse({ success: true, extras: itemData }));
                    
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE } }));
                }

            });
        }

    });
}

// Must be called last the his file
module.exports = Role;
