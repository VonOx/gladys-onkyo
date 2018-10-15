var shared = require('./onkyo.shared.js');
var Promise = require('bluebird');
var utils = require('./onkyo.utils.js');

module.exports = function update() {
  return gladys.device.getByService({
    service: 'onkyo'
  })
    .then((devices) => {

      devices.forEach(function(device) {
        var onkyo = shared.instances[device.id];
        if (!onkyo) {
          return reject(`Onkyo : No Onkyo receiver with deviceId ${params.deviceType.device}`);
        }
        return onkyo.isOn()
          .then(isOn => {
            if (isOn) {
              sails.log.info(`Onkyo : Receiver ${device.name} is on, updating current values.`);
              var currentValues = utils.getCurrentValues(onkyo).all;
              return Promise.props(currentValues, (value) => {
                var options = {
                  deviceIdentifier: device,
                  deviceService: 'onkyo',
                  deviceTypeIdentifier: value
                };
                return gladys.deviceType.getByIdentifier(options)
                  .then((deviceType) => utils.changeState(deviceType, value));
              });
            } else {
              return onkyo.isOff()
                .then(isOff => {
                  if (isOff) {
                    var options = {
                      deviceIdentifier: 'power',
                      deviceService: 'onkyo'
                    };
                    return gladys.deviceType.getByIdentifier(options)
                      .then((deviceType) => utils.changeState(deviceType, 0));
                  }
                });
            }
          });
      });
    });
};
