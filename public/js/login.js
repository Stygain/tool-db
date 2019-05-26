var swapButton = document.getElementsByClassName("swap")[0];
swapButton.addEventListener("click", swapUI);

var active = "login";

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

	//xhr.onreadystatechange = logContents;
	xhr.setRequestHeader('Content-Type', 'application/json')

	console.log(JSON.stringify(urlEncodedDataPairs));
	xhr.send(JSON.stringify(urlEncodedDataPairs));
}
