// Configuration of all the server routes

module.exports = {
	RouteHandler: routeHandler,
};

var pageConfig = {
	'/login': renderLogin,
};

function renderHome() {
	console.log("Would do home here");
}

function renderLogin() {
	console.log("Would do login here");
}

function routeHandler(route) {
	console.log("ROUTE: x" + route + "x");
	if (route == '/') {
		renderHome();
	}
	for (var routeRegex in pageConfig) {
		//console.log("ROUTE regex: " + routeRegex);
		var results = route.match(routeRegex);
		//console.log("RESULTS: " + results);
		if (route.match(routeRegex) != null) {
			console.log("MATCHED: " + routeRegex);
			pageConfig[routeRegex]();
		}
	}
	//pageConfig[route]();
}
