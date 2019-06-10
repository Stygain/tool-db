var delBtns = document.getElementsByClassName("delete-row");
console.log("Delete buttons:");
console.log(delBtns);

for (var i = 0; i < delBtns.length; i++) {
	delBtns[i].addEventListener('click', clickHandler, false);
	delBtns[i].index = i;
}

function clickHandler(event) {
	var field;

	console.log("Clicked");
	console.log(event.target.index);
	var tableRow = delBtns[event.target.index].parentElement.parentElement;
	console.log("Table row");
	console.log(tableRow);
	var rowTds = tableRow.getElementsByTagName('td');
	console.log("Children TDs");
	console.log(rowTds);

	//console.log("All rows");
	//var allRows = tableRow.parentElement.getElementsByTagName('td');
	//console.log(allRows);
	console.log("All rows");
	var allRows = tableRow.parentElement.getElementsByTagName('tr');
	console.log(allRows);
	var headerRow = allRows[0];
	console.log("Header row");
	console.log(headerRow);
	var headerRowElems = headerRow.getElementsByTagName('th');
	console.log("Header elems");
	console.log(headerRowElems);

	var headers = [];
	for (field = 0; field < headerRowElems.length; field++) {
		console.log(headerRowElems[field].innerHTML);
		headers.push(headerRowElems[field].innerHTML);
	}
	console.log("Headers");
	console.log(headers);


	// AJAX Request
	xhr = new XMLHttpRequest();

	var urlEncodedData = "";
	var urlEncodedDataPairs = {};

	if (!xhr) {
		alert("Cannot create http request.")
		return false;
	}

	console.log("Page:");
	var title = document.getElementsByTagName("title")[0].innerHTML;
	console.log(title);

	if (title == "Buildings") {
	    console.log("Making post to building delete");
	    xhr.open('POST', '/buildingDelete');
	} else if (title == "Locations") {
	    console.log("Making post to location delete");
	    xhr.open('POST', '/locationDelete');
	} else if (title == "Tools") {
	    console.log("Making post to tool delete");
	    xhr.open('POST', '/toolDelete');
	} else if (title == "Contains") {
	    console.log("Making post to contains delete");
	    xhr.open('POST', '/containsDelete');
	} else if (title == "Maintenance Company") {
	    console.log("Making post to maintainer delete");
	    xhr.open('POST', '/maintainerDelete');
	}
	for (field = 0; field < rowTds.length - 1; field++) {
		console.log(rowTds[field]);
		console.log(rowTds[field].innerHTML);
		urlEncodedDataPairs[headers[field]] = rowTds[field].innerHTML;
	}

	var statusCont = document.getElementById("status-container");
	xhr.onreadystatechange = function() {
		console.log("STATUS: " + this.status);
		if (this.status == 200) {
			document.getElementById("status").innerHTML = "Success!";
		} else {
			document.getElementById("status").innerHTML = "Failed to remove row!";
		}
		statusCont.style.display = "block";

		// Register a timeout to make it go away in a couple of seconds
		setTimeout(function(statusCont) {
	        	statusCont.style.display = "none";
	        	location.reload();
		}, 900, statusCont);
	};
	xhr.setRequestHeader('Content-Type', 'application/json')

	console.log("Constructed JSON to delete a row: " + JSON.stringify(urlEncodedDataPairs));
	xhr.send(JSON.stringify(urlEncodedDataPairs));

}
