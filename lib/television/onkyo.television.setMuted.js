var shared = require('../onkyo.shared.js');
const Promise = require('bluebird');

module.exports = function setMuted(params) {
  if(shared.instances[params.deviceType.device] === null) {
    return Promise.reject(new Error(`Onkyo : No Onkyo receiver with deviceId ${params.deviceType.device}`));
  }
  var onkyo = shared.instances[params.deviceType.device];
  if (onkyo.isOn() === true) {
    return onkyo.audioMute();
  }
};