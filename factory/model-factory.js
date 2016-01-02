var ModelFactory = function () {};

var console = process.console;

////USERS MODEL
//ModelFactory.CreateFromUser = function (user, callback) {
//    var UserProfileModel = require('../models/user-profile');
    

//    ModelFactory.CreateFromRoleId(user.id, function (found, r) {
//        var role = {};
//        if (found) {
//            role = r; //ModelFactory.CreateFromRole(r);
//        }
//        var userProfile ={
//            id: user._id,
//            email: user.email,
//            first_name: user.first_name,
//            last_name: user.last_name,
//            role: role
//        };
//        callback(userProfile);
//    });
    

//  //  return userProfileModel;
//}

//ModelFactory.CreateFromUserArray = function (userArray) {
    
//    var userProfileArray = [];
//    for (var i = 0, len = userArray.length; i < len; i++) {
//        userProfileArray.push(UserFactory.CreateFromUser(userArray[i]));
//    }

//    return userProfileArray;
//}


// CLIENTS MODEL
ModelFactory.CreateFromClient = function (client) {
    
   var clientModel = {
        client_id: client._id,
        client_name: client.name,
        private_key: client.private_key //ModelFactory.CreateFromPermissionIdArray(client.Permission_ids)
        
    };
    return clientModel;
}



ModelFactory.CreateFromClientArray = function (clientArray, callback) {
    
    var clients = [];
    for (i = 0; i < clientArray.length; i++) {
        clients.push(ModelFactory.CreateFromRole(clientArray[i]));
    }

    return clients;
}

ModelFactory.CreateFromClientId = function (id, callback) {
    var ClientModel = require('../models/clients');
    ClientModel.findOne({ _id: id }, function (err, client) {
        if (!err) {
            callback(ModelFactory.CreateFromClient(client), true);
            
        } else {
            callback(err, false);
        }
    });
    //return clients;
}


// ROLES MODEL
ModelFactory.CreateFromRole = function (role) {
    var roleModel = {
                id: role._id,
                name: role.name,
                permissions: role.permissions //ModelFactory.CreateFromPermissionIdArray(role.Permission_ids)
    };
    return roleModel;

   //if(role.Permission_ids.length>0){
   //     var PermissionsResp = SC.GetAllPermission({
   //         _id: { $in: role.Permission_ids },

   //         function() {
   //             var PermissionArray = ModelFactory.CreateFromPermissionIdArray(role.Permission_ids);
   //             callback(err, new me.ApiResponse({ success: true, extras: roleArray }));
   //         }
   //     });

    // }
    //var ids = "";
    //try {
    //    ids = role.permission_ids;
    //}
    //catch (e) { };
    //console.log(ids);
    //if (ids == "") return;
    //ModelFactory.CreateFromPermissionIdArray(ids, function (r, found) {
    //    var Permissions = {};
    //    if (found) {
    //        Permissions = r;
    //    }
    //    var roleModel = {};
    //    if (role) {
    //        roleModel = {
    //            id: role._id,
    //            name: role.name,
    //            permissions: Permissions //ModelFactory.CreateFromPermissionIdArray(role.Permission_ids)
    //        };
    //        callback(roleModel, true);
    //    } else {
    //        callback(roleModel, false);
    //    }

        
    //});

}



ModelFactory.CreateFromRoleArray = function (roleArray) {
    
    var roles = [];
    var i = 0;
    for (i = 0; i < roleArray.length; i++) {
        roles.push(ModelFactory.CreateFromRole(roleArray[i]));
    }
  //  function cb(r) {
  //      roles.push(r);
  //      if (i<roleArray.length ) {
  //          ModelFactory.CreateFromRole(roleArray[i], cb);
  //      } else {
  //          callback(roles, true);
  //      }
  //      i++;
  //  };
  return  roles;
}

ModelFactory.CreateFromRoleId = function (id, callback) {
    var RoleModel = require('../models/roles');
    RoleModel.findOne({ _id: id}, function (err, role) {
        if (!err) {
            //ModelFactory.CreateFromRole(role, function (roleResp) {
                callback(ModelFactory.CreateFromRole(role), true);
           // });
        } else {
            callback(err, false);
        }
    });
    //return roles;
}


// PermissionS MODEL

ModelFactory.CreateFromPermission = function (Permission) {
    
    var PermissionModel = {
        id: Permission._id,
        name: Permission.name
    };
    return PermissionModel;
}

ModelFactory.CreateFromPermissionArray = function (PermissionArray) {
    
    var Permissions = [];
  
    for (var i = 0, len = PermissionArray.length; i < len; i++) {
        Permissions.push(ModelFactory.CreateFromPermission(PermissionArray[i]));
    }

    return Permissions;
}

ModelFactory.CreateFromPermissionIdArray = function (PermissionArray, callback) {
    var Permission = require('../models/permissions');
    var PermissionsResp = {};
    //RoleModel.findOne({ _id: id }, function (er, Permission) {
        
    //});
    Permission.find({
        _id: {
            $in: PermissionArray
        
        }
    },

        function(err, Permissions) {
        if (!err) {
           // console.log(Permissions);
            callback(ModelFactory.CreateFromPermissionArray(Permissions), true)
        } else {
           // console.log(err);
            callback(err, false);
        }
        }
    );

}


// TEMPLATES MODEL

ModelFactory.CreateFromTemplate = function (template) {


    var templateModel = {
        id: template._id,
        name: template.name,
        content: template.content
    };
    return templateModel;
}

ModelFactory.CreateFromTemplateArray = function (templateArray) {

    var templates = [];
    for (var i = 0, len = templateArray.length; i < len; i++) {
        templates.push(ModelFactory.CreateFromTemplate(templateArray[i]));
    }

    return templates;
}



// USERS MODEL
ModelFactory.CreateFromUser = function (item) {
    
    var UserModel = UserModel = {
                id: item._id,
                first_name: item.first_name,
                middle_name: item.middle_name,
                last_name: item.last_name,
                email: item.email,
                suffix: item.suffix,
                dob: item.dob,
                gender: item.gender,
                full_name: (item.first_name || "") + ' ' 
                      + (item.middle_name || "") + ' ' 
                      + (item.last_name || "") + ' ' 
                      + (item.suffix || ""),
                role:item.role,
            };
    return UserModel;
}



ModelFactory.CreateFromUserArray = function (UserArray) {
    
    var Users = [];
    var i = 0;
    for (var i = 0, len = UserArray.length; i < len; i++) {
        Users.push(ModelFactory.CreateFromUser(UserArray[i]))
    }
    
   return Users;
}

ModelFactory.CreateFromUserId = function (id, callback) {
    var UserModel = require('../models/users');
    UserModel.findOne({ _id: id }, function (err, User) {
        if (!err) {
            callback(ModelFactory.CreateFromUser(User), true);
        } else {
            callback(err, false);
        }
    });
    //return Users;
}



module.exports = ModelFactory;