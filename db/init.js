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

	db.Connect(dbURL);

	//dropTables(function(status) {
	//});
	createUserTable(function(status) {
		if (!status) {
			process.exit(1);
		}
	});
	createBuildingTable(function(status) {
		if (!status) {
			process.exit(1);
		}
	});
	createLocationTable(function(status) {
		if (!status) {
			process.exit(1);
		}
	});
	createMaintenanceCompanyTable(function(status) {
		if (!status) {
			process.exit(1);
		}
	});
	createToolTable(function(status) {
		if (!status) {
			process.exit(1);
		}
	});
	createContainsTable(function(status) {
		if (!status) {
			process.exit(1);
		}
	});
}

function dropTables(results) {
	dropTable("User", function(status) {
	});
	dropTable("Building", function(status) {
	});
	dropTable("Location", function(status) {
	});
	dropTable("Maintenance Company", function(status) {
	});
	dropTable("Tool", function(status) {
	});
	dropTable("Contains", function(status) {
	});
}

function dropTable(table, results) {
	db.GetConnection(function(connection) {
		var query = sql.format('DROP TABLE IF EXISTS `?`', table);
		db.Query(query, function(status, msg) {
			if (!status) {
				console.log("ERROR: " + msg);
			}
			results(status);
		});
	});
}

function createBuildingTable(results) {
	db.GetConnection(function(connection) {
		var query = sql.format('CREATE TABLE IF NOT EXISTS `Building` (`address` VARCHAR(128) NOT NULL, `name` VARCHAR(20) NOT NULL, `manager` VARCHAR(128) NOT NULL, PRIMARY KEY (`address`), FOREIGN KEY (`manager`) REFERENCES `User` (`email`) ON DELETE CASCADE ON UPDATE CASCADE)');
		db.Query(query, function(status, msg) {
			if (!status) {
				console.log("ERROR: " + msg);
			}
			results(status);
		});
	});
}

function createLocationTable(results) {
	db.GetConnection(function(connection) {
		var query = sql.format('CREATE TABLE IF NOT EXISTS `Location` (`ID` INT(11) NOT NULL, `address` VARCHAR(128) NOT NULL, `name` VARCHAR(20) NOT NULL, PRIMARY KEY (`ID`), FOREIGN KEY (`address`) REFERENCES `Building` (`address`) ON DELETE CASCADE ON UPDATE CASCADE)');
		db.Query(query, function(status, msg) {
			if (!status) {
				console.log("ERROR: " + msg);
			}
			results(status);
		});
	});
}

function createToolTable(results) {
	db.GetConnection(function(connection) {
		var query = sql.format('CREATE TABLE IF NOT EXISTS `Tool` (`TID` INT(11) NOT NULL, `name` VARCHAR(60) NOT NULL, `business name` VARCHAR(60) NOT NULL, PRIMARY KEY (`TID`), FOREIGN KEY (`business name`) REFERENCES `Maintenance Company` (`name`) ON UPDATE CASCADE ON DELETE CASCADE)');
		db.Query(query, function(status, msg) {
			if (!status) {
				console.log("ERROR: " + msg);
			}
			results(status);
		});
	});
}

function createMaintenanceCompanyTable(results) {
	db.GetConnection(function(connection) {
		var query = sql.format('CREATE TABLE IF NOT EXISTS `Maintenance Company` (`name` VARCHAR(60) NOT NULL, `phone` VARCHAR(11) NOT NULL, `email` VARCHAR(128) NOT NULL, PRIMARY KEY (`name`))');
		db.Query(query, function(status, msg) {
			if (!status) {
				console.log("ERROR: " + msg);
			}
			results(status);
		});
	});
}

function createContainsTable(results) {
	db.GetConnection(function(connection) {
		var query = sql.format('CREATE TABLE IF NOT EXISTS `Contains` (`ID` INT(11) NOT NULL, `TID` INT(11) NOT NULL, PRIMARY KEY (`ID`, `TID`), FOREIGN KEY (`ID`) REFERENCES `Location` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`TID`) REFERENCES `Tool` (`TID`) ON DELETE CASCADE ON UPDATE CASCADE)');
		db.Query(query, function(status, msg) {
			if (!status) {
				console.log("ERROR: " + msg);
			}
			results(status);
		});
	});
}

function createUserTable(results) {
	db.GetConnection(function(connection) {
		var query = sql.format('CREATE TABLE IF NOT EXISTS `User` (`email` VARCHAR(50) NOT NULL, `password` VARCHAR(128) NOT NULL, PRIMARY KEY (`email`))');
		db.Query(query, function(status, msg) {
			if (!status) {
				console.log("ERROR: " + msg);
			}
			results(status);
		});
	});
}
