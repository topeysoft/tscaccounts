var Client = function () {
    
    this.crypto = require('crypto');
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response');
    this.ApiMessages = require('../models/api-messages');
    this.StringUtility = require('../utility/utility');
    this.Model = require('../models/clients');
    //this.Client = require('../models/Clients');
    //this.Template = require('../models/templates');
    this.LINQ = require('node-linq').LINQ;
    this.mongoose = require('mongoose');
    
    //this.session = session;
    // this.mailer = mailer;
    this.ModelFactory = require('../factory/model-factory');
};


// Client
Client.prototype.GetMany = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Model.find(params, function (err, items) {
        if (err) {
            console.error(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (items && items.length > 0) {
            
            
            var itemArray = me.ModelFactory.CreateFromClientArray(items);
            callback(err, new me.ApiResponse({ success: true, extras: itemArray }));

        } else {
            console.log("There was no Client found for this query" + params);
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

Client.prototype.GetOne = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Model.findOne(params, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemProfile = me.ModelFactory.CreateFromClient(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemProfile }));
        } else {
            
            // console.log("No Clients found by by the name " + name);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }


    });
}
Client.prototype.GetByName = function (name, callback) {
    var me = this;
    me.Model.findOne({ name: { $regex: new RegExp("^" + name + '$', "i") } }, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemProfile = me.ModelFactory.CreateFromClient(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemProfile }));
        } else {
            
            console.log("No Clients found by by the name " + name);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}


Client.prototype.GetById = function (id, callback) {
    var me = this;
    me.Model.findOne({ _id: id }, function (err, item) {
        if (err) {
            console.error(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (item) {
            var itemProfile = me.ModelFactory.CreateFromClient(item);
            callback(err, new me.ApiResponse({ success: true, extras: itemProfile }));
        } else {
            
            console.log("No item found by  the id " + id);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

Client.prototype.Update = function (id, newItem, callback) {
    var me = this;
    if (typeof (newItem) == "string") newItem = JSON.parse(newItem);
    //console.log(newUser);
    if (id != newItem.id) {
        return callback('', new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_OPERATION } }));
    }
    newItem.name = me.StringUtility.toClientName(newItem.name);
    me.Model.findOneAndUpdate({ _id: id }, newItem,

    function (err, updatedItem) {
        if (err) {
            console.error(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (updatedItem) {
            var item = me.ModelFactory.CreateFromClient(updatedItem);
            callback(err, new me.ApiResponse({ success: true, extras: { msg: me.ApiMessages.UPDATED, item: item } }));
        } else {
            console.log("Could not update Client");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}

Client.prototype.Delete = function (id, callback) {
    var me = this;
    
    me.Model.findOneAndRemove({ _id: id },

    function (err, removedItem) {
        if (err) {
            console.error(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        
        if (removedItem) {
            var item = ModelFactory.CreateFromClient(removedItem);
            callback(err, new me.ApiResponse({ success: true, extras: { msg: me.ApiMessages.DELETED, item: item } }));
        } else {
            console.log("Could not delete item");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}
Client.prototype.Create = function (r, callback) {
    var me = this;
    if (typeof (r) == "string") r = JSON.parse(r);
    
    var newItem = new me.Model(r);
    newItem.name = me.StringUtility.toClientName(newItem.name);

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
                    
                    var itemProfile = me.ModelFactory.CreateFromClient(item);
                    callback(err, new me.ApiResponse({ success: true, extras: itemProfile }));

                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE } }));
                }

            });
        }

    });
}


// Must be called last the his file
module.exports = Client;
