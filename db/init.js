// Initialize the database

var sql = require('mysql');
//var url = require('url');

var db = require('../db/db.js');

module.exports = {
	Setup: setup,
};

function setup() {
	console.log("Database URL:");
	dbURL = process.env.DATABASE_URL;
	console.log(dbURL);

	connection = sql.createConnection(dbURL);

	connection.connect(function(err) {
		if (err) {
			console.log("Error connecting to database: " + err);
			setTimeout(databaseConnect, 1000);
		}
		console.log("Successfully connected to database!");

		connection.on("error", function(err) {
			console.log("Database error: " + err);
			if (err.code === "PROTOCOL_CONNECTION_LOST") {
				databaseConnect();
			} else {
				throw err;
			}
		});
	});

	db.SetConnection(connection);
}
