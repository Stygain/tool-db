// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("fab_btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
	modal.style.display = "flex";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
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
	var inputList = document.querySelectorAll("input");

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
	} else if (button == 'maintainers') {
		console.log("Making post to maintainers");
		xhr.open('POST', '/maintainers');
	} else {
		console.log("Making post to NOTHING");
		for (field = 0; field < inputList.length; field++) {
			urlEncodedDataPairs[inputList[field].name] = inputList[field].value;
		}
	}

	//var modal = document.getElementById("status-container");
	//xhr.onreadystatechange = function() {
	//    console.log("STATUS: " + this.status);
	//    if (this.status == 200) {
	//	document.getElementById("status").innerHTML = "Success!";
	//    } else {
	//	document.getElementById("status").innerHTML = "Failed to authenticate user!";
	//    }
	//    modal.style.display = "block";

	//    // Register a timeout to make it go away in a couple of seconds
	//    setTimeout(function(modal) {
	//		modal.style.display = "none";
	//		window.location.replace("localhost:3000/");
	//		location.reload();
	//    }, 900, modal);
	//};
	//xhr.setRequestHeader('Content-Type', 'application/json')

	//console.log(JSON.stringify(urlEncodedDataPairs));
	//xhr.send(JSON.stringify(urlEncodedDataPairs));
}
