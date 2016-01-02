var console = process.console;
var SecurityController = function () {

    this.crypto = require('crypto');
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
   // this.UserProfileModel = require('../models/user-profile.js');
    this.Perm = require('../models/permissions.js');
    this.Role = require('../models/roles.js');
    this.Template = require('../models/templates.js');
    this.LINQ = require('node-linq').LINQ;
    this.mongoose = require ('mongoose');
     
    //this.session = session;
   // this.mailer = mailer;
   this.ModelFactory = require('../factory/model-factory.js');
};


// Role
SecurityController.prototype.GetAllRole = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Role.find(params, function (err, role) {
        if (err) {
            if (err) {
                console.log(err);
            }
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (role && role.length > 0) {
           

                   var roleArray = me.ModelFactory.CreateFromRoleArray(role);
                        callback(err, new me.ApiResponse({ success: true, extras: roleArray }));
                
        } else {
            console.log("There was no role found for this query");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

SecurityController.prototype.GetRoleByName = function (name, callback) {
    var me = this;
    me.Role.findOne({ name: { $regex: new RegExp("^" + name+'$', "i") } }, function (err, role) {
        if (err) {
            if (err) {
                console.log(err);
            }
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (role) {
            var roleProfile = me.ModelFactory.CreateFromRole(role);
            callback(err, new me.ApiResponse({ success: true, extras: roleProfile }));
        } else {
            
                console.log("No roles found by by the name "+name);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

SecurityController.prototype.GetRoleById = function (id, callback) {
    var me = this;
    me.Role.findOne({ _id: id }, function (err, role) {
        if (err) {
            if (err) {
                console.log(err);
            }
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (role) {
            var roleProfile = me.ModelFactory.CreateFromRole(role);
            callback(err, new me.ApiResponse({ success: true, extras: roleProfile }));
        } else {
                console.log("No row found for this ID: "+id);
            
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}
SecurityController.prototype.UpdateRole = function (id, newRole, callback) {
    var me = this;
    //console.log(newUser);
    if (id != newRole.id) {
        console.log("invalid operation");

        console.log(newRole.id);
        console.log(id);
        console.log(newRole);

       

        return callback('', new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_OPERATION } }));
    }
    newRole.permission_ids = new me.LINQ(newRole.permissions)
    .Select(function (p) { return p.id; })
    .ToArray();
    //console.log(newRole);
    me.Role.update({ _id: id }, newRole,

    function  (err, numAffected) {
        if (err) {
                console.log(err);
            
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (numAffected >0) {
            callback(err, new me.ApiResponse({ success: true, extras: me.ApiMessages.UPDATED }));
        } else {
                console.log("Could not update role");
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}

SecurityController.prototype.CreateRole = function ( r, callback) {
    var me = this;
    var newRole = new me.Role(r);
    me.Role.findOne({ name: newRole.name }, function (err, role) {

        if (err) {
            if (err) {
                console.log(err);
            }
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (role) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.ALREADY_EXISTS } }));
        } else {
           
            newRole.save(function (err, role, numberAffected) {

                if (err) {
                    if (err) {
                        console.log(err);
                    }
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }

                if (numberAffected === 1) {

                    var roleProfile = me.ModelFactory.CreateFromRole(role);
                    callback(err, new me.ApiResponse({ success: true, extras: roleProfile }));

                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE } }));
                }

            });
        }

    });
}


// PERMISSIONS
SecurityController.prototype.GetAllPerm = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Perm.find(params, function (err, perm) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (perm && perm.length > 0) {

            var permArray = me.ModelFactory.CreateFromPermArray(perm);
            callback(err, new me.ApiResponse({ success: true, extras: permArray }));

        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

SecurityController.prototype.GetPermByName = function (name, callback) {
    var me = this;
    me.Perm.findOne({ name: { $regex: new RegExp("^" + name + '$', "i") } }, function (err, perm) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (perm) {
            var permProfile = me.ModelFactory.CreateFromPerm(perm);
            callback(err, new me.ApiResponse({ success: true, extras: permProfile }));
        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

SecurityController.prototype.GetPermById = function (id, callback) {
    var me = this;
    me.Perm.findOne({ _id: id }, function (err, perm) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (perm) {
            var permProfile = me.ModelFactory.CreateFromPerm(perm);
            callback(err, new me.ApiResponse({ success: true, extras: permProfile }));
        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}
SecurityController.prototype.UpdatePerm = function (id, newPerm, callback) {
    var me = this;
    //console.log(newUser);
    if (id != newPerm.id) {
        console.log(newPerm.id);
        console.log(id);
        console.log(newPerm);

        return callback('', new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_OPERATION } }));
    }
    me.Perm.update({ _id: id }, newPerm,

    function (err, numAffected) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (numAffected > 0) {
            callback(err, new me.ApiResponse({ success: true, extras: me.ApiMessages.UPDATED }));
        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}

SecurityController.prototype.CreatePerm = function (r, callback) {
    var me = this;
    var newPerm = new me.Perm(r);
    me.Perm.findOne({ name: newPerm.name }, function (err, perm) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (perm) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.ALREADY_EXISTS } }));
        } else {

            newPerm.save(function (err, perm, numberAffected) {

                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }

                if (numberAffected === 1) {

                    var permProfile = me.ModelFactory.CreateFromPerm(perm);
                    callback(err, new me.ApiResponse({ success: true, extras: permProfile }));

                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE } }));
                }

            });
        }

    });
}




// TEMPLATES
SecurityController.prototype.GetAllTemplate = function (params, callback) {
    if (typeof (params) == "undefined") params = {};
    var me = this;
    me.Template.find(params, function (err, template) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (template && template.length > 0) {

            var templateArray = me.ModelFactory.CreateFromTemplateArray(template);
            callback(err, new me.ApiResponse({ success: true, extras: templateArray }));

        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}

SecurityController.prototype.GetTemplateByNameOrId = function (name, callback) {
    var me = this;
    var id = "";
    var cond ={ name: { $regex: new RegExp("^" + name + '$', "i") } };

    try {
        me.mongoose.Types.ObjectId(name);
        cond={_id:id};
    } catch (e) {
    
    }
    me.Template.findOne( cond , function (err, template) {
        if (err) {
            console.log(err);
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (template) {
            var templateProfile = me.ModelFactory.CreateFromTemplate(template);
            callback(err, new me.ApiResponse({ success: true, extras: templateProfile }));
        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_FOUND }));
        }

    });
}


SecurityController.prototype.UpdateTemplate = function (id, newTemplate, callback) {
    var me = this;
    //console.log(newUser);
    if (id != newTemplate.id) {
        console.log(newTemplate.id);
        console.log(id);
        console.log(newTemplate);

        return callback('', new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_OPERATION } }));
    }
    me.Template.update({ _id: id }, newTemplate,

    function (err, numAffected) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (numAffected > 0) {
            callback(err, new me.ApiResponse({ success: true, extras: me.ApiMessages.UPDATED }));
        } else {
            callback(err, new me.ApiResponse({ success: false, extras: me.ApiMessages.NOT_CHANGED }));
        }

    });
}

SecurityController.prototype.CreateTemplate = function (r, callback) {
    var me = this;
    var newTemplate = new me.Template(r);
    me.Template.findOne({ name: newTemplate.name }, function (err, template) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (template) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.ALREADY_EXISTS } }));
        } else {

            newTemplate.save(function (err, template, numberAffected) {

                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }

                if (numberAffected === 1) {

                    var templateProfile = me.ModelFactory.CreateFromTemplate(template);
                    callback(err, new me.ApiResponse({ success: true, extras: templateProfile }));

                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE } }));
                }

            });
        }

    });
}
// Must be called last the his file
module.exports = SecurityController;