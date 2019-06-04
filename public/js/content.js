var delBtns = document.getElementsByClassName("delete-row");
console.log("Delete buttons:");
console.log(delBtns);

for (var i = 0; i < delBtns.length; i++) {
	delBtns[i].addEventListener('click', clickHandler, false);
	delBtns[i].index = i;
}
//for (var index in delBtns) {
//	delBtns[index].addEventListener("click", clickHandler);
//}

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

	console.log("Making post to delete");
	xhr.open('POST', '/buildingDelete');
	for (field = 0; field < rowTds.length - 1; field++) {
		console.log(rowTds[field]);
		console.log(rowTds[field].innerHTML);
		urlEncodedDataPairs[headers[field]] = rowTds[field].innerHTML;
	}

	var modal = document.getElementById("status-container");
	xhr.onreadystatechange = function() {
	    console.log("STATUS: " + this.status);
	    //if (this.status == 200) {
		//document.getElementById("status").innerHTML = "Success!";
	    //} else {
		//document.getElementById("status").innerHTML = "Failed to authenticate user!";
	    //}
	    //modal.style.display = "block";

	    //// Register a timeout to make it go away in a couple of seconds
	    //setTimeout(function(modal) {
		//	modal.style.display = "none";
		//	window.location.replace("localhost:3000/");
		//	location.reload();
	    //}, 900, modal);
	};
	xhr.setRequestHeader('Content-Type', 'application/json')

	console.log("Constructed JSON to delete a row: " + JSON.stringify(urlEncodedDataPairs));
	xhr.send(JSON.stringify(urlEncodedDataPairs));

}
