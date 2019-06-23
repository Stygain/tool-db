// One-time Setup

var handlebarsSetup = require('./handlebars/setup.js');
var dbSetup = require('./db/init.js');

module.exports = {
	Setup: setup,
};


function setup() {
	handlebarsSetup.RegisterHelper();
	dbSetup.Setup();
}
