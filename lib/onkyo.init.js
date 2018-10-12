var shared = require('./onkyo.shared.js');
var Promise = require('bluebird');
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
          .then(() => sails.log.info(`Onkyo : Receiver ${device.name} already on, update current values.`))
          .then(() => {
            var currentValues = utils.getCurrentValues(shared.instances[device.id]).all;
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
