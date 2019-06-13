// One-time Setup

var handlebarsSetup = require('./handlebars/setup.js');

module.exports = {
	Setup: setup,
};


function setup() {
	handlebarsSetup.RegisterHelper();
}
