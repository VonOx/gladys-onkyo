var shared = require('./onkyo.shared.js');
var { Onkyo } = require('onkyo.js');

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
          .then(() => sails.log.info(`Onkyo : ${device.name} initialized, updating current states.`))
          .then(() => {
            var thedevice = {
              id: device.id
            };
            return gladys.deviceType.getByDevice(thedevice)
              .then(function (deviceTypes) {
                deviceTypes.forEach(function(deviceType) {
                  switch (deviceType.identifier) {
                  case 'power':
                    shared.instances[device.id].powerStatus().then(function (result) {
                      if (result.PWR === false && deviceType.lastValue !== 0) {
                        gladys.deviceState.create({ devicetype: deviceType.id, value: 0 });
                      } else if (result.PWR === true && deviceType.lastValue !== 1) {
                        gladys.deviceState.create({ devicetype: deviceType.id, value: 1 });
                      }
                    });
                    break;
                  case 'volume':
                    shared.instances[device.id].getVolume().then(function (result) {
                      if (result !== deviceType.lastValue) {
                        return gladys.deviceState.create({ devicetype: deviceType.id, value: result });
                      }
                    });
                    break;
                  case 'mute':
                    shared.instances[device.id].audioStatusMute().then(function (result) {
                      if (result.AMT === false && deviceType.lastValue !== 0) {
                        gladys.deviceState.create({ devicetype: deviceType.id, value: 0 });
                      } else if (result.AMT === true && deviceType.lastValue !== 1) {
                        gladys.deviceState.create({ devicetype: deviceType.id, value: 1 });
                      }
                    });
                    break;
                  }
                });
              });
          });
      });
    });
};
