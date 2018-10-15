var shared = require('./onkyo.shared.js');

module.exports = function update() {

  return gladys.device.getByService({
    service: 'onkyo'
  })
    .then((devices) => {
      devices.forEach(function (device) {
        var onkyo = shared.instances[device.id];
        if (!onkyo) {
          return reject(`Onkyo : No Onkyo receiver with deviceId ${params.deviceType.device}`);
        }
        var thedevice = {
          id: device.id
        };
        return gladys.deviceType.getByDevice(thedevice)
          .then(function (deviceTypes) {
            deviceTypes.forEach(function(deviceType) {
              switch (deviceType.identifier) {
              case 'power':
                onkyo.powerStatus().then(function (result) {
                  if (result.PWR === false && deviceType.lastValue !== 0) {
                    gladys.deviceState.create({ devicetype: deviceType.id, value: 0 });
                  } else if (result.PWR === true && deviceType.lastValue !== 1) {
                    gladys.deviceState.create({ devicetype: deviceType.id, value: 1 });
                  }
                });
                break;
              case 'volume':
                onkyo.getVolume().then(function (result) {
                  if (result !== deviceType.lastValue) {
                    return gladys.deviceState.create({ devicetype: deviceType.id, value: result });
                  }
                });
                break;
              case 'mute':
                onkyo.audioStatusMute().then(function (result) {
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
};
