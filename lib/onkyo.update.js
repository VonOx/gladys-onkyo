var shared = require('./onkyo.shared.js');
var Promise = require('bluebird');
var utils = require('./onkyo.utils.js');

module.exports = function update(params) {
    return gladys.device.getByService({
            service: 'onkyo'
        })
        .then((devices) => {

            devices.forEach(function(device) {
                var onkyo = shared.instances[params.deviceType.device];
                if (!onkyo) {
                    return reject(`Onkyo : No Onkyo receiver with deviceId ${params.deviceType.device}`);
                }
                return onkyo.isOn()
                    .then(() => sails.log.info(`Onkyo : Receiver ${device.name} already on, update current values.`))
                    .then(() => {
                        var currentValues = utils.getCurrentValues(onkyo).all
                        return Promise.props(currentValues, (value) => {
                            var options = {
                                deviceIdentifier: device,
                                deviceService: 'onkyo',
                                deviceTypeIdentifier: value
                            };
                            return gladys.deviceType.getByIdentifier(options)
                                .then((deviceType) => utils.changeState(deviceType, value));
                        });
                    });
            });
        });
};