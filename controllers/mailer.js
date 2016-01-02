//var app = require('../app');
var config = require('../config/config');
var mailer = require('express-mailer');

//console.log(config.mailer_config);

try {
    mailer.extend(app, config.mailer_config);
} catch (e) {}

var Mailer = function (app) {
  //console.log(app);
 	this.mailer = app.mailer;
   
};

Mailer.prototype.sendPasswordResetHash = function (email, token) {
    this.mailer.send('emails/password-reset-email', {
    to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
    subject: 'Password Reset Email', // REQUIRED. 
    token: token// All additional properties are also passed to the template as local variables. 
  }, function (err) {
    if (err) {
      // handle error 
      console.log(err);
      //res.send('There was an error sending the email');
      return;
    }
    //res.send('Email Sent');
  });
};

module.exports = Mailer;