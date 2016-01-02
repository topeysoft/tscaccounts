var checkIfInstalled=function (req, res, next) {
    var config_file = 'config/config.json';
    var config_url = "/config/initialsetup";
    
    
    try {
        // Query the entry
        stats = fs.lstatSync(config_file);
        // At this point, config file was found 
        if (req.path == config_url) {
            // There is no need to serve the setup page
            res.redirect("/"); // Redirect to home page
        } else {
            var config = require('../config/config');
            req.config = config;
            return next(); // Otherwise proceed
        }
        
    }
catch (e) {
        console.log("Not yet Installed");
        
        if (req.path != config_url) {
            // res.send(req.path);
            res.redirect(config_url);
        } else {
            return next();
        }
        
    }
    
}


module.exports = checkIfInstalled;