var Promise = require('bluebird');
var shared = require('./onkyo.shared.js');

module.exports = function exec(params) {
    var onkyo = shared.instances[params.deviceType.device];
    if (!onkyo) {
        return Promise.reject(new Error(`Onkyo : ${params.deviceType.device} not found`));
    }

    return new Promise(function (resolve, reject) {

        switch (params.deviceType.type) {
            case 'binary':
                if (params.state.value == 1) {
                    sails.log.debug('Onkyo : powerOn');
                    onkyo.powerOn();
                } else {
                    sails.log.debug('Onkyo : powerOff');
                    onkyo.powerOff();
                }
                onkyo.powerStatus().then(function (result) {
                    return resolve((result['PWR'] == false) ? 0 : 1);
                });
                break;
        };

        return resolve();
    });
};