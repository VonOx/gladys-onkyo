var Promise = require('bluebird');
var shared = require('./onkyo.shared.js');
var utils = require('./onkyo.utils.js');

function setCurrentVolume(onkyo, device) {
    return utils.getCurrentValues(onkyo)
        .then(function (values) {
            gladys.deviceType.getByDevice(device)
                .then((deviceTypes) => {
                    deviceTypes.forEach((deviceType) => {
                        if (deviceType.identifier === 'volume') {
                            return utils.changeState(deviceType, values.volume);
                        }
                    });
                });
        });
}

module.exports = function exec(params) {
    sails.log.debug(`Onkyo : ${JSON.stringify(params)}`);

    return new Promise(function (resolve, reject) {
        var onkyo = shared.instances[params.deviceType.device];
        if (!onkyo) {
            return reject(`Onkyo : No Onkyo receiver with deviceId ${params.deviceType.device}`);
        }

        switch (params.deviceType.deviceTypeIdentifier) {
            case 'power':
                if (params.state.value === 1) {
                    sails.log.debug('Onkyo : Switch to power On');
                    return onkyo.powerOn()
                        .then(() => {
                            setCurrentVolume(onkyo, params.deviceType.device)
                                .then(() => {
                                    return resolve(params.state.value);
                                });
                        });
                } else {
                    sails.log.debug('Onkyo : Switch to power Off');
                    onkyo.powerOff()
                        .then(function () {
                            utils.getCurrentValues(onkyo)
                                .then((values) => {
                                    return resolve(values.power);
                                });
                        });;
                }
                onkyo.powerStatus().then(function (result) {
                    return resolve((result.PWR === false) ? 0 : 1);
                });
                break;
            case 'volume':
                return onkyo.isOn()
                    .then(function () {
                        onkyo.setVolume(params.state.value)
                            .then(function () {
                                utils.getCurrentValues(onkyo)
                                    .then((values) => {
                                        return resolve(values.volume);
                                    });
                            });
                    })
                    .catch((err) => {
                        return reject(err);
                    });
                break;
            case 'mute':
                return onkyo.isOn()
                    .then(function () {
                        if (params.state.value === 1) {
                            sails.log.debug('Onkyo : Mute receiver');
                            onkyo.audioMute()
                                .then(function () {
                                    utils.getCurrentValues(onkyo)
                                        .then((values) => {
                                            return resolve(values.mute);
                                        });
                                });
                        } else {
                            sails.log.debug('Onkyo : UnMute receiver');
                            onkyo.audioUnMute()
                                .then(function () {
                                    utils.getCurrentValues(onkyo)
                                        .then((values) => {
                                            return resolve(values.mute);
                                        });
                                });
                        }
                    })
                    .catch((err) => {
                        return reject(err);
                    });
                break;
            default:
                sails.log.error(`Onkyo : No exec function for this identifier (${params.deviceType.identifier})!`);
                return reject();
                break;
        }
    });
};