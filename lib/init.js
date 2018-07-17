var Onkyo = require('eiscp');

module.exports = function init() {
	return gladys.device.getByService({service: 'onkyo'})
		.then((devices) => {
		})
        .catch((err) => {
            sails.log.warn(`Onkyo : Error while initializing Onkyo device in Gladys. ${err}`);
});
};