
var console = process.console;

var express = require('express');
var router = express.Router();
var authorize = require('../security/authorize');
//var HttpStatusCodes = require("../models/http-status");
var HttpStatusCodes = require("http-status-codes");
var ApiMessages = require("../models/api-messages");
var jade = require("jade");
var fs = require('fs');
var extend = require('extend');
var ApiMessages = require("../models/api-messages");
var request = {};
var config_file = 'config/config.json';
var PermModel = require("../models/permissions");
var RoleModel = require("../models/roles");
var mongoose = require("mongoose");
var Utility = require('../utility/utility');

//var PerformSearch = function (req, res, next) {
//    var r = function (err, obj) {
//        if (err) {
//            console.error(err);
//            res.status(HttpStatusCodes.BAD_REQUEST).send(obj);
//        } else {
//            if (!obj.success) {
//                res.status(HttpStatusCodes.NOT_FOUND).send(obj);
//            }
//            else {
//                res.send(obj);
//            }
//        }
//    };
//    if (!req.params.model) {
//        Dal.SearchAll(req.query.query, r);
//    } else {
//        var model = Dal[req.params.model];
//        if (!model) {
//            res.status(HttpStatusCodes.BAD_REQUEST).send(
//              { success: false, extras: ApiMessages.INVALID_OPERATION });
//        }
//        model.Search(req.query.query, r);
//    }
//}

//var GetLinksForItem = function (req, res, next) {
//    var r = function (err, obj) {
//        if (err) {
//            console.error(err);
//            res.status(HttpStatusCodes.BAD_REQUEST).send(obj);
//        } else {
//            if (!obj.success) {
//                res.status(HttpStatusCodes.NOT_FOUND).send(obj);
//            }
//            else {
//                res.send(obj);
//            }
//        }
//    };


//    Dal.GetLinksForItem(req.params.id, r);

//}


//router.get('/search', authorize({ scope: "genoapp" }), PerformSearch);
//router.get('/search/:model', authorize({ scope: "genoapp" }), PerformSearch);
//router.get('/getlinks/:id', authorize({ scope: "genoapp" }), GetLinksForItem);
var Render = function (response, obj, template) {
    
    if (!template) template = "error";
    
    var themeUri = "public/admin/installer/";
    var templateUri = themeUri + template + ".jade";
    
    
    
    var data = { article: obj };
    
    data["initializer"] = "var obj={}";
    data["themeUri"] = themeUri;
    data["current_user"] = request.current_user || false;
    data.role = data.current_user.role || false;
    data.permissions = data.role.permissions || false;
    data.is_edit_mode = request.is_edit_mode;
    //data["permissions"] = req.decoded.permissions;
    try {
        data["initializer"] = "var obj=" + JSON.stringify(obj);
        console.log("CURRENT USER INSIDE RENDER: ", data["current_user"]);
    } catch (e) {
        console.error(e);
    }
    
    // Compile a function
    var fn = jade.compileFile(templateUri, {});
    
    //// Render the function
    var html = fn(data);
    response.send(html);
    
}

router.get('/initialsetup/:a*?',
    //authorize({ scope: "genoapp" }),
    function (req, res, next) {
    request = req;
    //TODO: Check to see if application is already installed
    
    var r = function (err, obj) {
        if (err) {
            console.error(err);
            res.status(HttpStatusCodes.BAD_REQUEST).send(obj);
        } else {
            if (!obj.success) {
                res.status(HttpStatusCodes.NOT_FOUND).send(obj);
            }
            else {
                res.send(obj);
            }
        }
       // next();
    };
    Render(res, {}, "index");
    //   console.error(model);
   // model.GetMany({}, r);
});


router.post('/initialsetup/:a*?',
    //authorize({ scope: "genoapp" }),
    function (req, res, next) {
    request = req;
    
    //Check to see if application is already installed
    var stats = false;
    try {
        // Query the entry
        stats = fs.lstatSync(config_file);
       
        
    }
catch (e) { }
    
    if (!stats) {
        var r = function (err, obj) {
            if (err) {
                console.error(err);
                res.status(HttpStatusCodes.BAD_REQUEST).send(obj);
            } else {
                if (!obj.success) {
                    res.status(HttpStatusCodes.NOT_FOUND).send(obj);
                }
                else {
                    res.send(obj);
                }
            }
       // next();
        };
        
        var data = req.body.setupData;
        if (data && data.admin && data.admin.email) {
            var UserModel = new (require("../model/users"));
            var roles = require('../config/_default_roles.json');
            var perm = require('../config/_default_permissions.json');
                 
            PermModel.Remove({}, function (err) {
                if (err) {
                    return next(err);
                } else {
                    RoleModel.collection.insert(roles, function () {
                        if (err) {
                            console.error("ERROR WHILE CREATING DEFAULT PERMISSIONS", err);
                        }
                    });
                }
            });
            RoleModel.Remove({}, function (err) {
                if (err) {
                    return next(err);
                } else {
                    RoleModel.collection.insert(roles, function () {
                        if (err) {
                            console.error("ERROR WHILE CREATING DEFAULT ROLES", err);
                        }
                    });
                }
            });
            
            UserModel.Remove({}, function (err) {
                if (err) {
                    return next(err);
                } else {
                    data.admin.role = {
                        "name": "ADMINISTRATOR",
                        "description": "Administrator role",
                        "permissions": [
                            {
                                "name": "MANAGE_CONTENT",
                                "description": "Special permission that allows a user to manage content. This include create, modify and delete."
                            },
                            {
                                "name": "MANAGE_USERS",
                                "description": "Special permission that allows a user to manage users. This include create, modify and delete."
                            },
                            {
                                "name": "MANAGE_FILES",
                                "description": "Special permission that allows a user to manage files. This include create, modify and delete."
                            },
                            {
                                "name": "MANAGE_ROLES",
                                "description": "Special permission that allows a user to manage permissions. This include create, modify and delete."
                            },
                            {
                                "name": "MANAGE_PERMISSIONS",
                                "description": "Special permission that allows a user to manage permissions. This include create, modify and delete."
                            }
                        ]
                    };
                    UserModel.Create(data.admin, function (err, obj) {
                        if (err) {
                           res.send({ success: false, extras: { msg: "Unable to create admin" } });
                            
                    
                        } else {
                            createConfig(data, req, res, next);
                        }
                    });
                }
            });

         
        }
        //fs.renameSync('/config/_config.json', config_file)
        //fs.closeSync(fs.openSync(config_file, 'w'));
        
        //Render(res, {}, "index");
        //console.log(e_config);
        //model.Update({}, r);
    } else {
        res.redirect("/");
    }
});



function createConfig(data, req, res, next){
    delete data.admin;
    
    
    var e_config = require('../config/_config');
    extend(true, e_config, data);
    req.config = e_config;
    fs.writeFileSync(config_file, JSON.stringify(e_config), { flag: "w" });
    res.status(HttpStatusCodes.CREATED).send({ success: true });
}
router.get('/:model',
    //authorize({ scope: "genoapp" }),
    function (req, res, next) {
    request = req;
    var r = function (err, obj) {
        if (err) {
            console.error(err);
            res.status(HttpStatusCodes.BAD_REQUEST).send(obj);
        } else {
            if (!obj.success) {
                res.status(HttpStatusCodes.NOT_FOUND).send(obj);
            }
            else {
                res.send(obj);
            }
        }
       // next();
    };
    var model = Dal[req.params.model];
    if (!model) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(
            { success: false, extras: ApiMessages.INVALID_OPERATION });
    }
    //   console.error(model);
    model.GetMany({}, r);
});

router.get('/:model/:id',
    authorize({ scope: "genoapp" }), 
    function (req, res, next) {
    request = req;
    var r = function (err, obj) {
        if (err) {
            console.error(err);
            res.status(HttpStatusCodes.BAD_REQUEST).send(obj);
        } else {
            if (!obj.success) {
                res.status(HttpStatusCodes.NOT_FOUND).send(obj);
            }
            else {
                res.send(obj);
            }
        }
    };
    var model = Dal[req.params.model];
    if (!model) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(
            { success: false, extras: ApiMessages.INVALID_OPERATION });
    }
    var c_id = req.params.id;
    if (c_id == "me") {
        c_id = req.decoded_token.id;
        if (req.params.model == 'kins') {
            model.GetByEmail(req.decoded_token.user_profile.email, r);
        } else {
            model.GetById(c_id, r);
        }
        
    } else {
        model.GetById(c_id, r);
    }
 //   console.error(model);
     
});


router.post('/:model',
    authorize({ scope: "genoapp" }), function (req, res, next) {
    request = req;
    if (!req.body.item) return res.sendStatus(HttpStatusCodes.BAD_REQUEST);
    var r = function (err, obj) {
        if (err) {
            console.error(err);
            res.status(HttpStatusCodes.BAD_REQUEST).send(obj);
        } else {
            if (!obj.success) {
                res.status(HttpStatusCodes.UNKNOWN_ERROR).send(obj);
            }
            else {
                res.status(HttpStatusCodes.CREATED).send(obj);
            }
        }
    };
    var model = Dal[req.params.model];
    if (!model) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(
            { success: false, extras: ApiMessages.INVALID_OPERATION });
    }
    try {
        var author = req.current_user;
        req.body.item.author = author;
    } catch (e) {

    }
    
    model.Create(req.body.item, r);
});

router.put('/:model/:id', authorize({ scope: "genoapp" }), function (req, res, next) {
    if (!req.body.item) return res.sendStatus(HttpStatusCodes.BAD_REQUEST);
    var r = function (err, obj) {
        if (err) {
            console.error(err);
            res.status(HttpStatusCodes.NOT_MODIFIED).send(obj);
        } else {
            res.status(HttpStatusCodes.OK).send(obj);
        }
    };
    var model = Dal[req.params.model];
    if (!model) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(
            { success: false, extras: ApiMessages.INVALID_OPERATION });
    }
    
    try {
        var author = req.current_user;
        req.body.item.author = author;
    } catch (e) {

    }
    model.Update(req.params.id, req.body.item, r);
});

router.delete('/:model/:id', authorize({ scope: "genoapp" }), function (req, res, next) {
    var r = function (err, obj) {
        if (err) {
            console.error(err);
            res.status(HttpStatusCodes.NOT_MODIFIED).send(obj);
        } else {
            res.send(obj);
        }
    };
    
    var model = Dal[req.params.model];
    if (!model) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(
            { success: false, extras: ApiMessages.INVALID_OPERATION });
    }
    model.Delete(req.params.id, r);
});




module.exports = router;
