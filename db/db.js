// DB Interaction

var sql = require('mysql');

module.exports = {
	Connect: databaseConnect,
	GetConnection: getConnection,
	SetConnection: setConnection,
	Query: query,
};

var connection;

/* ********************
 * Database continual-connection
******************** */
function databaseConnect(dbURL) {
	console.log("Connecting to database.");

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
				databaseConnect(dbURL);
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

/* ********************
 * Database connection getter
******************** */
function setConnection(newConnection) {
	connection = newConnection;
};

/* ********************
 * Database query passthrough
******************** */
function query(query, content) {
	console.log("Querying database: " + query);

	connection.query(query, function(error, results, fields) {
		if (error) {
			content(0, error);
		} else {
			content(1, results);
		}
	});
}
