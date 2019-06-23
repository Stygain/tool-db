// Parse Results of DB Queries

module.exports = {
	ParseOutTitlesAndContent: parseOutTitlesAndContent,
	ParseOutContentLocationsAndTools: parseOutContentLocationsAndTools,
	ParseOutContentBuildingsAndLocations: parseOutContentBuildingsAndLocations,
	ConvertSelectResultsToArray: convertSelectResultsToArray,
};

/* ********************
 * 
******************** */
function parseOutTitlesAndContent(results, content) {
	var titleArr = [];
	var contentArr = [];

	console.log("TITLES AND CONTENT");
	console.log(results);
	if (results === undefined || results.length == 0) {
		console.log("DOING EMPTY");
		content(titleArr, contentArr);
	}

	for (var key in Object.keys(results[0])) {
		var tmpObj = {title: Object.keys(results[0])[key]};
		titleArr.push(tmpObj);
	}

	// Generate the content
	for (var index in results) {
		var tmpArr = [];
		for (var jndex in results[index]) {
			var tmpSubObj = {content: results[index][jndex]};
			tmpArr.push(tmpSubObj);
		}
		contentArr.push(tmpArr);
	}

	// Callback to return the data
	content(titleArr, contentArr);
};

/* ********************
 * 
******************** */
function parseOutContentLocationsAndTools(results, content) {
	// Generate the content
	var contentArr = [];
	var contentObj = {};
	var currObj = {};
	var currArr = [];
	for (var index in results) {
		var contentStr = '';
		for (var jndex in results[index]) {
			if (jndex == "lname") {
				objectName = results[index][jndex];
			} else if (jndex == "name") {
				contentStr += " " + results[index][jndex];
			} else if (jndex == "TID") {
				contentStr += " " + results[index][jndex];
			}
		}
		var tmpSubObj = {content: contentStr};
		currArr.push(tmpSubObj);
		currObj.data = currArr;
		var tmpArr = [];
		tmpArr.push(currObj);
		//contentArr = contentArr.concat(tmpArr);
		if (!contentObj[objectName]) {
			contentObj[objectName] = [];
		}
		contentObj[objectName].push(tmpSubObj);

		currObj = {};
		currArr = [];
		objectName = '';
	}

	var finalArr = [];
	for (var item in contentObj) {
		var outerObj = {};
		outerObj.title = item;
		outerObj.data = contentObj[item];
		finalArr.push(outerObj);
	}

	// Callback to return the data
	content(finalArr);
};

/* ********************
 * 
******************** */
function parseOutContentBuildingsAndLocations(results, content) {
	// Generate the content
	var contentArr = [];
	var contentObj = {};
	var currObj = {};
	var currArr = [];
	for (var index in results) {
		var contentStr = '';
		for (var jndex in results[index]) {
			if (jndex == "name") {
				objectName = results[index][jndex];
			} else if (jndex == "lname") {
				contentStr += " " + results[index][jndex];
			} else if (jndex == "ID") {
				contentStr += " " + results[index][jndex];
			}
		}
		var tmpSubObj = {content: contentStr};
		currArr.push(tmpSubObj);
		currObj.data = currArr;
		var tmpArr = [];
		tmpArr.push(currObj);
		//contentArr = contentArr.concat(tmpArr);
		if (!contentObj[objectName]) {
			contentObj[objectName] = [];
		}
		contentObj[objectName].push(tmpSubObj);

		currObj = {};
		currArr = [];
		objectName = '';
	}

	var finalArr = [];
	for (var item in contentObj) {
		var outerObj = {};
		outerObj.title = item;
		outerObj.data = contentObj[item];
		finalArr.push(outerObj);
	}

	// Callback to return the data
	content(finalArr);
};

/* ********************
 * 
******************** */
function convertSelectResultsToArray(results, callback) {
	var resultsArr = [];
	for (var index in results) {
		for (var keyVar in Object.keys(results[index])) {
			var key = Object.keys(results[index])[keyVar];
			var results2 = results[index];
			var tmpObj = {label: results[index][key], value: results[index][key]};
			resultsArr.push(tmpObj);
		}
	}

	callback(resultsArr);
};
