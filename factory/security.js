var SecurityFactory = function () { };
// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    config = require('../config/config'),
    password = 'tscd6F3Efeqtsc',
jwt = require('jsonwebtoken');

SecurityFactory.encrypt = function (text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

SecurityFactory.decrypt = function (text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

SecurityFactory.toToken = function (obj) {
    var token = jwt.sign(obj, config.jwt_private_key, config.jwt_options);
    return token;
}

SecurityFactory.ensureAuthorized = function (req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(bearerToken, config.jwt_private_key, config.jwt_options, function (err, decoded) {
            if (err) {
                res.send(401, "invalid token");
            } else {
                req.decoded_token = decoded;
                //console.log(decoded);
                next();
            }
        });
       // var decoded = jwt.verify(token, config.jwt_private_key, config.jwt_options);
        
    } else {
        res.send(401);
    }
}

SecurityFactory.requireRole=function (roles) {
    return function (req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, config.jwt_private_key, config.jwt_options, function (err, decoded) {
                if (err) {
                    res.send(401, "invalid token");
                } else {
                    if (roles.toUpperCase().indexOf(decoded.role.text.toUpperCase())>=0) {
                        res.send(401, "Permission denied");
                    } else {
                        req.decoded_token = decoded;
                        //console.log(decoded);
                        next();
                    }
                   
                }
            });
            // var decoded = jwt.verify(token, config.jwt_private_key, config.jwt_options);

        } else {
            res.send(401);
        }
    }
}

SecurityFactory.requireRole = function (roles) {
    return function (req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, config.jwt_private_key, config.jwt_options, function (err, decoded) {
                if (err) {
                    res.send(401, "invalid token");
                } else {
                    if (roles.toUpperCase().indexOf(decoded.role.text.toUpperCase()) < 0) {
                        res.send(401, "Permission denied");
                    } else {
                        req.decoded_token = decoded;
                        //console.log(decoded);
                        next();
                    }

                }
            });
            // var decoded = jwt.verify(token, config.jwt_private_key, config.jwt_options);

        } else {
            res.send(401);
        }
    }
}

SecurityFactory.can = function (permission) {
    return function (req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, config.jwt_private_key, config.jwt_options, function (err, decoded) {
                if (err) {
                    res.send(401, "invalid token");
                } else {
                    var not_valid = false;
                    try {
                        not_valid = (permission.indexOf(decoded.role.value) < 0);
                    } catch (e) {

                    }
                    if (not_valid) {
                        res.send(401, "Permission denied");
                    } else {
                        req.decoded_token = decoded;
                        //console.log(decoded);
                        next();
                    }

                }
            });
            // var decoded = jwt.verify(token, config.jwt_private_key, config.jwt_options);

        } else {
            res.send(401);
        }
    }
}
module.exports = SecurityFactory;