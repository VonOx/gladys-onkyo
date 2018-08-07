var shared = require('./onkyo.shared.js');
var OnkyoPkg = require('onkyo.js')

module.exports = function init() {
    return gladys.device.getByService({ service: 'onkyo' })
        .then((devices) => {

            // reset all instances 
            shared.instances = {};

            // foreach device, create an instance
            devices.forEach(function (device) {
                onkyoJson = new Object();
                onkyoJson.address = device.identifier;
                shared.instances[device.id] = OnkyoPkg(onkyoJson);
            });
        });
};