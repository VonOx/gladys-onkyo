var Promise = require('bluebird');

module.exports = {
  getCurrentValues: function getCurrentValues(onkyo) {
    return new Promise(function (resolve, reject) {
      onkyo.getDeviceState()
        .then(function (deviceState) {
          var power = deviceState.PWR;
          var muted = deviceState.AMT;
          var volume = deviceState.MVL;

          sails.log.debug(`Onkyo : Powered ${power}`);
          sails.log.debug(`Onkyo : Muted ${muted}`);
          sails.log.debug(`Onkyo : Volume ${volume}`);

          return resolve({
            power: (power === true) ? 1 : 0,
            mute: (muted === true) ? 1 : 0,
            volume: volume
          });
        });
    });
  },

  changeState: function changeState(deviceType, value) {
    return gladys.deviceState.create(newState)
      .then((state) => {
        sails.log.info(`Onkyo : state ${deviceType.identifier} created`);
        return state;
      })
      .catch(function (err) {
        sails.log.error(`Onkyo : Error, state ${deviceType.identifier} not created!`);
        return Promise.reject(err);
      });
  }
};