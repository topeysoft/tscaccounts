var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('./models/session');
var sass = require('node-sass-middleware');
var methodOverride = require('method-override');
var scribe =require('scribe-js/scribe')(); //loads Scribe
var fs = require('fs');
var console = process.console;
//var routes = require('./routes/index');

  app = express();

var mongoose = require('mongoose');
//mongoose.connect('mongodb://71.51.203.72:27017/userapi', 
//mongoose.connect('mongodb://192.168.1.104:27017/tscusers', 
//mongoose.connect('mongodb://127.0.0.1:27017/userapi', 
mongoose.connect('mongodb://topeysoft:tinbed123@ds037215.mongolab.com:63124/tscaccounts', 
    function (err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});
  
 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/logs', scribe.webPanel());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var installCheck = require("./security/install-check");




//app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(installCheck);
//var router = express.Router();





var users = require('./routes/users');
var admin = require('./routes/admin');
var access = require('./routes/access');
var api = require('./routes/api');
var configRoutes = require('./routes/config');
//app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/access', access);
app.use('/api', api);
app.use('/config', configRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(
     sass({
         src: __dirname + '/sass', //where the sass files are 
         dest: __dirname + '/public', //where css should go
         debug: true // obvious
     })
 );
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
