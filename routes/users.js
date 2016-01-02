var console = process.console;

var AccountController = require('../controllers/account');
var UserController = require('../controllers/user');
var  Mailer =require('../controllers/mailer');
var express = require('express');
var router = express.Router();
var User = require('../models/users');
var session = require('../models/session');
var security = require('../factory/security');
var perm = require('../models/api-permissions');

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


/* GET users listing. */
router.post('/register', function(req, res, next) {
  var user = new User(req.body);
 var r =  function(err, respObj){
   res.send(respObj);
 };
 AC.register(user, req.body.password, r);
});

router.post('/logon', function(req, res, next) {
 // var user = new User(req.body);
 var r =  function(err, respObj){
   res.send(respObj);
 };
 AC.logon(req.body.email, req.body.password, r);
});

router.post('/authenticate', function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    AC.authenticate(req.body.email, req.body.password, r);
});

router.post('/resetRequest', function(req, res, next) {
 // var user = new User(req.body);
 var r =  function(err, respObj){
   res.send(respObj);
 };
 AC.resetPassword(req.body.email, r);
});

router.post('/resetPassword', function(req, res, next) {
 // var user = new User(req.body);
 var r =  function(err, respObj){
   res.send(respObj);
 };
 AC.resetPasswordFinal(req.body.email, req.body.newPassword,  req.body.token, r);
});

router.get('/', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    UC.GetAll({}, r);
});

router.get('/:id([[a-z[A-Z[0-9]{3,28})', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    var id = req.params.id;
    //console.log(id);
    UC.GetById(id, r);
});

router.get('/me', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    //console.log(req.decoded_token);
    UC.GetByEmail(req.decoded_token.user_profile.email, r);
});

router.put('/:id([[a-z[A-Z[0-9]{3,28})', security.can(perm.MANAGE_USERS), function (req, res, next) {
    //var user = new User(req.body);
    var user = req.body.user;
    var r = function (err, respObj) {
        res.send(respObj);
    };
    var id = req.params.id;
    console.log(req.body.user);
    UC.UpdateUser(id, user, r);
});

module.exports = router;
