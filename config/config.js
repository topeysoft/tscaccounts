var config = {};
try {
    config = require("../config/config.json");
} catch (e) { }

module.exports = config;