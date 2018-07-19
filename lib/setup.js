var Onkyo = require('eiscp');

module.exports = function setup() {
    
    Onkyo.discover({devices: 1, timeout: 5}).then(function (result) {
        sails.log.info(`Onkyo : Found these receivers on the local network: ${result}`);
    });
	
	return Promise.resolve();
};