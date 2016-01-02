var console = process.console;

var express = require('express');
var router = express.Router();
var security = require('../factory/security');
var info = require('../config/info.json');
var templates = require('../config/templates.json');

var security = require('../factory/security');
var authorize = require('../security/authorize');

var SecurityController = require('../controllers/security');

var SC = new SecurityController();


//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION');
    res.header('Access-Control-Allow-Headers', "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
}
router.use(allowCrossDomain);


/* GET admin home page. */
router.get('/', function (req, res, next) {
    //var installCheck = require("../security/install-check");
    
    if (!req.config) {
        return installCheck(req, res, next);
    } else {
        console.error("APP CONFIG", req.config);
       return res.sendfile('admin/page.html');
    }
});

/* GET admin info. */
router.get('/info', authorize({permissions: {}}), function (req, res, next) {
   // SC.GetAllRole({}, info.roles);
  //  console.log(info);
    res.send({ success: true, extras: info });
});


/* GET admin info. */
router.get('/roles', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.GetAllRole({}, r);
});

/* GET admin info. */
router.post('/roles/create', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.CreateRole(req.body, r);
});

/* GET admin info. */
router.put('/roles/:id', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.UpdateRole(req.params.id, req.body, r);
});

/* GET admin info. */
router.get('/roles/:id([[a-z[A-Z[0-9]{3,28})', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.GetRoleById(req.params.id, r);
});



// PERMISSIONS
/* GET admin info. */
router.get('/permissions', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.GetAllPerm({}, r);
});

/* GET admin info. */
router.post('/permissions/create', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.CreatePerm(req.body, r);
});

/* GET admin info. */
router.put('/permissions/:id', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.UpdatePerm(req.params.id, req.body, r);
});

/* GET admin info. */
router.get('/permissions/:id([[a-z[A-Z[0-9]{3,28})', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.GetPermById(req.params.id, r);
});



// TEMPLATES
router.get('/templates', security.ensureAuthorized, function (req, res, next) {
  
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.GetAllTemplate({}, r);
    //res.send({ success: true, extras: templates });
});

/* GET admin info. */
router.post('/templates/create', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.CreateTemplate(req.body, r);
});

/* GET admin info. */
router.put('/templates/:id', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    SC.UpdateTemplate(req.params.id, req.body.item, r);
});

/* GET admin info. */
router.get('/templates/:name([[a-z[A-Z[0-9]{3,28})', security.ensureAuthorized, function (req, res, next) {
    // var user = new User(req.body);
    var r = function (err, respObj) {
        res.send(respObj);
    };
    //var LINQ = require('node-linq').LINQ;

    //var tmpl = new LINQ(templates)
    //        .Where(function (a) {
    //           return a.name == req.params.name;
    //        })
            
    //        .ToArray();
    //resp = { success: true, extras: tmpl };
    //r("", resp);
    SC.GetTemplateByNameOrId(req.params.name, r);
});

module.exports = router;
