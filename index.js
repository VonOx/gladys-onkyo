module.exports = function(sails) {

    var setup = require('./lib/setup.js');
    var init = require('./lib/init.js');
    var exec = require('./lib/exec.js');

    gladys.on('ready', function() {
        init();
    });

    return {
        setup,
        init,
        exec,
    };
};