// DB Interaction

var sql = require('mysql');

module.exports = {
	Connect: databaseConnect,
	GetConnection: getConnection,
};

var connection;

/* ********************
 * Database continual-connection
******************** */
function databaseConnect() {
	console.log("Connecting to database.");

	connection = sql.createConnection("mysql://cs340_bartonad:potato@classmysql.engr.oregonstate.edu/cs340_bartonad");

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
};

/* ********************
 * Database connection getter
******************** */
function getConnection(content) {
	content(connection);
};
