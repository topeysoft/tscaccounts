var session = require('express-session');
var FileStore = require('session-file-store')(session);
 var uuid = require('node-uuid');

module.exports = session({
    store: new FileStore(),
    genid: function(req) {
        return uuid.v4 // use UUIDs for session IDs
      },
    secret: 'tscsession'
});