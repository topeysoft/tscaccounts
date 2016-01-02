var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    
    password = 'tscd6F3Efeqtsc',
    jwt = require('jsonwebtoken');
var config = false;
try {
    config = require('../config/config.json');
} catch (err) {
    console.log("There was an error locating config file. App probably not installed.", err);

}
var DAL = new (require("../dal/dal"))();
var authorize = function (options, enforce) {
    //console.log("First:::Entrance");
    
    if (enforce === undefined) enforce = true;
    return function (req, res, next) {
        if (!config) {
            res.redirect("/config/initialsetup");
        }
        if (options) { }
        
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, config.jwt_private_key, config.jwt_options, function (err, decoded) {
                if (err) {
                    if (enforce) {
                        res.status(401).send("invalid token");
                    } else {
                        next();
                    }
                } else {
                    var r = "";
                    // try {
                    //     r = decoded.role.text;
                    // } catch (e) {
                    //
                    // }
                    //if (roles.toUpperCase().indexOf(r.toUpperCase()) >= 0) {
                    //    res.send(401, "Permission denied");
                    //} else {
                    req.decoded_token = decoded;
                    //console.log("DECODED TOKEN: ", req.decoded_token);
                    var model = DAL["users"];
                    if (model) {
                        model.GetByEmail(decoded.user_profile.email, function (err, obj) {
                            if (!err && obj && obj.success) {
                                var perms = {};
                                obj.extras.role.permissions.forEach(function (perm) {
                                    perms["can_" + perm.name.toLowerCase()] = true;
                                    obj.extras["can_" + perm.name.toLowerCase()] = true;
                                })
                                req.current_user = obj.extras;
                                req.current_user.permissions = perms;
                               
                            }
                            
                            req.decoded_token.user_profile = req.current_user;
                           // console.log("CURRENT_USER: ", req.current_user);
                           // console.log("CURRENT_USER_PERMISSIONS: ", req.current_user.permissions);
                            next();
                        });
                       
                          
                           
                    } else {
                        next();
                    }
                   //   console.error(model);
                   
                   //}

                }
            });
           // var decoded = jwt.verify(token, config.jwt_private_key, config.jwt_options);

        } else {
            if (enforce) {
                res.status(401).send("Unautorized");
            } else {
                next();
            }
        }
    }
}

module.exports = authorize;
