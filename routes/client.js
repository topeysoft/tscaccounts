
var console = process.console;

var express = require('express');
var router = express.Router();
var authorize = require('../security/authorize');
var DAL = require("../dal/clients");
var HttpStatusCodes = require("http-status-codes");
var ApiMessages = require("../models/api-messages");


var Client = new DAL();



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



router.get('/:model/',
    authorize({ scope: "genoapp" }),
    function (req, res, next) {
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
    model.GetMany({}, r);
});

router.get('/:model/:id/',
    //authorize({ scope: "genoapp" }), 
    function (req, res, next) {
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
   // console.log(req.body);
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
