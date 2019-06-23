// Functions to query and parse the database data

var sql = require('mysql');

var db = require('./db.js');
var dbParser = require('./parser.js');

module.exports = {
	LocationsAndTools: getLocationsAndToolsData,
	BuildingsAndLocations: getBuildingsAndLocationsData,
	Buildings: getBuildingsData,
	Locations: getLocationsData,
	Tools: getToolsData,
	Maintainers: getMaintainerData,
};

/* ********************
 * Query the DB to get the
******************** */
function getLocationsAndToolsData(user, content) {
	// Generate the select statement
	var query = sql.format('SELECT `Location`.`ID`, `Location`.`name` AS lname, `Tool`.`TID`, `Tool`.`name` FROM Building, Location, Tool, Contains, (SELECT Location.ID FROM Location WHERE 1) AS lids WHERE `lids`.`ID` = `Location`.`ID` AND `lids`.`ID` = `Contains`.`ID` AND `Contains`.`TID` = `Tool`.`TID` AND `Building`.`Manager` = ? AND `Location`.`address` = `Building`.`address`', user);

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
function getBuildingsAndLocationsData(user, content) {
	// Generate the select statement
	var query = sql.format('SELECT `Building`.`address`, `Building`.`name`, `Location`.`ID`, `Location`.`name` AS lname FROM Building, Location WHERE `Location`.`address` = `Building`.`address` AND `Building`.`Manager` = ?', user);

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

///* ********************
// * Query the DB to get the contains table data and construct the response JSO for handlebars
// ******************** */
//function getContainsData(content) {
//	// Generate the select statement
//	var query = sql.format('SELECT * FROM Contains WHERE 1');
//
//	// Execute the select statement
//	db.Query(query, function(status, results) {
//		// Pass the error back if present
//		if (!status) {
//			console.log("ERROR: " + results);
//			return;
//		}
//		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
//			// Callback to return the data
//			content(titles, parsedContent);
//		});
//	});
//}

/* ********************
 * Query the DB to get the buildings table data and construct the response JSO for handlebars
******************** */
function getBuildingsData(user, content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Building WHERE `Building`.`manager` = ?', user);

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
function getLocationsData(user, content) {
	// Generate the select statement
	var query = sql.format('SELECT `Location`.* FROM Location, Building WHERE `Location`.`address` = `Building`.`address` AND `Building`.`Manager` = ?', user);

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
function getToolsData(user, content) {
	// Generate the select statement
	var query = sql.format('SELECT `Tool`.* FROM Tool, Location, Building, Contains WHERE `Tool`.`TID` = `Contains`.`TID` AND `Contains`.`ID` = `Location`.`ID` AND `Location`.`address` = `Building`.`address` AND `Building`.`Manager` = ?', user);

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
function getMaintainerData(user, content) {
	// Generate the select statement
	var query = sql.format('SELECT `Maintenance Company`.* FROM `Maintenance Company`, Tool, Location, Building, Contains WHERE `Tool`.`business name` = `Maintenance Company`.`name` AND `Tool`.`TID` = `Contains`.`TID` AND `Contains`.`ID` = `Location`.`ID` AND `Location`.`address` = `Building`.`address` AND `Building`.`Manager` = ?', user);

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
