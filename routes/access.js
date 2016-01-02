var console = process.console;

var AccountController = require('../controllers/account');
var UserController = require('../controllers/user');
var Mailer = require('../controllers/mailer');
var express = require('express');
var router = express.Router();
var User = require('../models/users');
var session = require('../models/session');
var security = require('../factory/security');

var mailer = new Mailer(app);
var AC = new AccountController(session, mailer);
var UC = new UserController(session, mailer);


//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION');
    res.header('Access-Control-Allow-Headers', "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
}
router.use(allowCrossDomain);



router.post('/register', function (req, res, next) {
    var user = new User(req.body);
    var r = function (err, respObj) {
        if (err) {
            console.debug(err);
        }
        res.send(respObj);
    };
    AC.register(user, req.body.password, r);
});

router.post('/authenticate', function (req, res, next) {
    // var user = new User(req.body);
   // console.log(req.body);
    var r = function (err, respObj) {
        if (err) {
            console.debug(err);
        }
        res.send(respObj);
    };
    AC.authenticate(req.body.email, req.body.password, r);
});

router.post('/resetRequest', function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        if (err) {
            console.debug(err);
        }
        res.send(respObj);
    };
    AC.resetPassword(req.body.email, r);
});

router.post('/resetPassword', function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        if (err) {
            console.debug(err);
        }
        res.send(respObj);
    };
    AC.resetPasswordFinal(req.body.email, req.body.newPassword, req.body.token, r);
});

module.exports = router;
