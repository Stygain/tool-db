// Functions to query and parse the database data

var sql = require('mysql');

var db = require('./db.js');
var dbParser = require('./parser.js');

module.exports = {
	LocationsAndTools: getLocationsAndToolsData,
	BuildingsAndLocations: getBuildingsAndLocationsData,
	Contains: getContainsData,
	Buildings: getBuildingsData,
	Locations: getLocationsData,
	Tools: getToolsData,
	Maintainers: getMaintainerData,
	Contains: getContainsData,
};

/* ********************
 * Query the DB to get the
******************** */
function getLocationsAndToolsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT `Location`.`ID`, `Location`.`name` AS lname, `Tool`.`TID`, `Tool`.`name` FROM Location, Tool, Contains, (SELECT Location.ID FROM Location WHERE 1) AS lids WHERE `lids`.`ID` = `Location`.`ID` AND `lids`.`ID` = `Contains`.`ID` AND `Contains`.`TID` = `Tool`.`TID`');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutContentLocationsAndTools(results, function(parsedContent) {
			// Callback to return the data
			content(parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the
******************** */
function getBuildingsAndLocationsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT `Building`.`address`, `Building`.`name`, `Location`.`ID`, `Location`.`name` AS lname FROM Building, Location WHERE `Location`.`address` = `Building`.`address`');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutContentBuildingsAndLocations(results, function(parsedContent) {
			// Callback to return the data
			content(parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the contains table data and construct the response JSO for handlebars
 ******************** */
function getContainsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Contains WHERE 1');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the buildings table data and construct the response JSO for handlebars
******************** */
function getBuildingsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Building WHERE 1');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the locations table data and construct the response JSO for handlebars
******************** */
function getLocationsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Location WHERE 1');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the tools table data and construct the response JSO for handlebars
******************** */
function getToolsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Tool WHERE 1');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the tools table data and construct the response JSO for handlebars
******************** */
function getMaintainerData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM `Maintenance Company` WHERE 1');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}
