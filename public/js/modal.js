// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("fab_btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var cancel = document.getElementById("cancel");

// When the user clicks the button, open the modal 
btn.onclick = function() {
	modal.style.display = "flex";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
}

// When the user clicks on the cancel button, close the modal
cancel.onclick = function() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

function submitAction(button) {
	// AJAX Request
	xhr = new XMLHttpRequest();

	var urlEncodedData = "";
	var urlEncodedDataPairs = {};
	var field;
	var inputList1 = document.querySelectorAll("input");
	var inputList2 = document.querySelectorAll("select");

	if (!xhr) {
		alert("Cannot create http request.")
		return false;
	}

	if (button == 'buildings') {
		console.log("Making post to buildings");
		xhr.open('POST', '/buildings');
	} else if (button == 'locations') {
		console.log("Making post to locations");
		xhr.open('POST', '/locations');
	} else if (button == 'tools') {
		console.log("Making post to tools");
		xhr.open('POST', '/tools');
	} else if (button == 'contains') {
		console.log("Making post to contains");
		xhr.open('POST', '/contains');
	} else if (button == 'maintainers') {
		console.log("Making post to maintainers");
		xhr.open('POST', '/maintainers');
	}
	for (field = 0; field < inputList1.length; field++) {
		urlEncodedDataPairs[inputList1[field].name] = inputList1[field].value;
	}
	for (field = 0; field < inputList2.length; field++) {
		urlEncodedDataPairs[inputList2[field].name] = inputList2[field].value;
	}

	var statusCont = document.getElementById("status-container");
	xhr.onreadystatechange = function() {
	    console.log("STATUS: " + this.status);
		modal.style.display = "none";
		if (this.status == 200) {
			document.getElementById("status").innerHTML = "Success!";
		} else {
			document.getElementById("status").innerHTML = "Error adding data!";
		}
		statusCont.style.display = "block";

		// Register a timeout to make it go away in a couple of seconds
		setTimeout(function(statusCont) {
			    statusCont.style.display = "none";
			    location.reload();
		}, 900, statusCont);
	};
	xhr.setRequestHeader('Content-Type', 'application/json')

	console.log("Encoded Data: " + JSON.stringify(urlEncodedDataPairs));
	xhr.send(JSON.stringify(urlEncodedDataPairs));
}
