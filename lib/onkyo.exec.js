var Promise = require('bluebird');
var shared = require('./onkyo.shared.js');
var utils = require('./onkyo.utils.js');

module.exports = function exec(params) {
    sails.log.debug(`Onkyo : ${JSON.stringify(params)}`);

    return new Promise(function(resolve, reject) {
        var onkyo = shared.instances[params.deviceType.device];
        if (!onkyo) return reject(`Onkyo : No Onkyo receiver with deviceId ${params.deviceType.device}`);
        

        switch (params.deviceType.deviceTypeIdentifier) {
            case 'power':
                if (params.state.value == 1) {
                    sails.log.debug('Onkyo : powerOn');
                    onkyo.powerOn();
                } else {
                    sails.log.debug('Onkyo : powerOff');
                    onkyo.powerOff();
                }
                onkyo.powerStatus().then(function(result) {
                    return resolve((result.PWR == false) ? 0 : 1);
                });
                break;
        }

        return resolve();
    });
};