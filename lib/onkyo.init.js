var shared = require('./onkyo.shared.js');
var {Onkyo} = require('onkyo.js');

module.exports = function init() {
    return gladys.device.getByService({ service: 'onkyo' })
        .then((devices) => {

            // reset all instances 
            shared.instances = {};

            // foreach device, create an instance
            devices.forEach(function (device) {
                shared.instances[device.id] = new Onkyo({address : device.identifier});
                shared.instances[device.id].on('connected', () => sails.log.info(`Onkyo : Onkyo Network Receiver connected`));
            });
        });
};