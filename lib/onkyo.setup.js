const Promise = require('bluebird');
const { OnkyoDiscover } = require('onkyo.js');

module.exports = function setup() {

    OnkyoDiscover.DiscoverFirst()
        .then((onkyo) => {

            var modelName = onkyo.device.info.modelName;
            var onkyoIp = onkyo.device.address;
            sails.log('Onkyo : %s Receiver found at %s', modelName, onkyoIp);


            var newDevice = {
                device: {
                    name: `Onkyo (${modelName})`,
                    protocol: 'wifi',
                    service: 'onkyo',
                    identifier: onkyoIp,
                },
                types: [
                    {
                        name: 'Power',
                        identifier: 'power',
                        tag: 'Home Cinema',
                        type: 'binary',
                        sensor: false,
                        min: 0,
                        max: 1
                    },
                    {
                        name: 'Mute',
                        identifier: 'mute',
                        tag: 'Mute',
                        type: 'binary',
                        sensor: false,
                        min: 0,
                        max: 1
                    },
                    {
                        name: 'Volume',
                        identifier: 'volume',
                        tag: 'Volume',
                        type: 'volume',
                        unit: 'dB (x10)',
                        sensor: false,
                        min: 0,
                        max: 70
                    }
                ]
            };
            gladys.device.create(newDevice)
                .then(() => {
                    sails.log.info(`Onkyo : New Onkyo Network Receiver added with success`);
                })
                .catch((err) => {
                    sails.log.warn(`Onkyo : Error while adding Onkyo device in Gladys. ${err}`);
                });

        });
    return Promise.resolve();
};