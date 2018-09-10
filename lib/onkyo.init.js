var shared = require('./onkyo.shared.js');
var { Onkyo } = require('onkyo.js');
var utils = require('./onkyo.utils.js');

module.exports = function init() {
    return gladys.device.getByService({ service: 'onkyo' })
        .then((devices) => {

            // reset all instances 
            shared.instances = {};

            // foreach device, create an instance
            devices.forEach(function (device) {
                shared.instances[device.id] = new Onkyo({ address: device.identifier });
                shared.instances[device.id].on('connected', () => sails.log.info(`Onkyo : Onkyo Network Receiver connected`));
                return shared.instances[device.id].isOn()
                    .then(function () {
                        return utils.getCurrentValues(shared.instances[device.id])
                            .then(function (values) {
                                gladys.deviceType.getByDevice(device)
                                    .then((deviceTypes) => {
                                        deviceTypes.forEach((deviceType) => {
                                            if (values.hasOwnProperty(deviceType.identifier)) {
                                                return utils.changeState(deviceType, values[deviceType.identifier])
                                            }
                                        });
                                    });
                            });
                    });
            });
        });
};