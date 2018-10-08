module.exports = function(sails) {

    var setup = require('./lib/onkyo.setup.js');
    var init = require('./lib/onkyo.init.js');
    var exec = require('./lib/onkyo.exec.js');
    var update = require('./lib/onkyo.update.js');


    gladys.on('ready', function() {
        init();
    });

    return {
        setup,
        init,
        exec,
        update
    };
};