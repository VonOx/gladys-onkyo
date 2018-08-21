var Promise = require('bluebird');

module.exports = {
    getCurrentValues: function getCurrentValues(onkyo) {
        return new Promise(function(resolve, reject) {
            yamaha.getDeviceState()
                .then(function(deviceState) {
                    var power = deviceState.pwrState();
                    var muted = deviceState.muteState();
                    var volume = deviceState.volumeState();

                    sails.log.debug(`Onkyo : Powered ${power}`);
                    sails.log.debug(`Onkyo : ${muted}`);
                    sails.log.debug(`Onkyo : ${volume}`);

                    return resolve({
                        power: power ? 1 : 0,
                        mute: muted ? 1 : 0,
                        volume: volume
                    });
                });
        });
    },

    changeState: function changeState(deviceType, value) {
        return new Promise(function(resolve, reject) {
            var newState = {
                devicetype: deviceType.id,
                value: value
            };

            gladys.deviceState.create(newState)
                .then(function(state) {
                    console.log(`Onkyo : state ${deviceType.identifier} created`);
                    return resolve();
                })
                .catch(function(err) {
                    console.log(`Onkyo : Error, state ${deviceType.identifier} not created!`);
                    return reject();
                });
        });
    }
};