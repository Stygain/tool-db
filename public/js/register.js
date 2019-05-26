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
	console.log("RECEIVED button press");

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
		xhr.open('POST', 'http://localhost:3000/login');
		for (field = 0; field < inputList.length - 1; field++) {
			urlEncodedDataPairs[inputList[field].name] = inputList[field].value;
		}
	} else {
		console.log("Making post to register");
		xhr.open('POST', 'http://localhost:3000/register');
		for (field = 0; field < inputList.length; field++) {
			urlEncodedDataPairs[inputList[field].name] = inputList[field].value;
		}
	}

	//xhr.onreadystatechange = logContents;
	xhr.setRequestHeader('Content-Type', 'application/json')

	console.log(JSON.stringify(urlEncodedDataPairs));
	xhr.send(JSON.stringify(urlEncodedDataPairs));
}
