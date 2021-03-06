var swapButton = document.getElementsByClassName("swap")[0];
swapButton.addEventListener("click", swapUI);

var active = "register";

function swapUI() {
	var login = document.getElementsByClassName("login-container")[0];
	var register = document.getElementsByClassName("register-container")[0];

	if (active == "login") {
		active = "register";
		setTimeout(function() {
			swapButton.innerHTML = "Login";
		}, 500);
		changeActiveCard(register, login);
	} else {
		active = "login";
		setTimeout(function() {
			swapButton.innerHTML = "Register";
		}, 500);
		changeActiveCard(login, register);
	}
}

function changeActiveCard(new_active, old_active) {
	new_active.classList.add("right-open");

	setTimeout(function() {
		new_active.classList.remove("bck");
		old_active.classList.add("bck");
		setTimeout(function() {
			new_active.classList.remove("right-open");
		}, 10);
	}, 450);
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

	if (button == 'login') {
		console.log("Making post to login");
		xhr.open('POST', '/login');
		console.log("InputList: " + inputList);
		for (field = 0; field < 2; field++) {
			console.log("Thing: " + inputList[field]);
			console.log("Value: " + inputList[field].value);
			urlEncodedDataPairs[inputList[field].name] = inputList[field].value;
		}
	} else {
		console.log("Making post to register");
		xhr.open('POST', '/register');
		for (field = 0; field < inputList.length; field++) {
			urlEncodedDataPairs[inputList[field].name] = inputList[field].value;
		}
	}

	var statusCont = document.getElementById("status-container");
	xhr.onreadystatechange = function() {
	    console.log("STATUS: " + this.status);
	    if (this.status == 200) {
			document.getElementById("status").innerHTML = "Success!";
	    } else {
			document.getElementById("status").innerHTML = "Failed to authenticate user!";
	    }
	    statusCont.style.display = "block";

	    // Register a timeout to make it go away in a couple of seconds
	    setTimeout(function(statusCont) {
			statusCont.style.display = "none";
			location.reload();
	    }, 900, statusCont);
	};
	xhr.setRequestHeader('Content-Type', 'application/json')

	console.log(JSON.stringify(urlEncodedDataPairs));
	xhr.send(JSON.stringify(urlEncodedDataPairs));
}
