// Configuration of all the server routes

var renderer = require('./handlebars/renderer.js');
var auth = require('./auth.js');

module.exports = {
	RouteHandler: routeHandler,
};

var pageConfig = {
	'/login': renderLogin,
	'/register': renderRegister,
	'/buildings': renderBuildings,
	'/locations': renderLocations,
	'/tools': renderTools,
	'/contains': renderContains,// Remove this page eventually
	'/maintainers': renderMaintainers,
	'/locations_and_tools': renderLocationsAndTools,
	'/buildings_and_locations': renderBuildingsAndLocations,
	'/logout': handleLogout,
};

/* ********************
 * Handle get requests for /home
******************** */
function renderHome(request, response) {
	console.log("Render Home");

	renderer.RenderHomePage(request, response);
};

/* ********************
 * Handle get requests for /login
******************** */
function renderLogin(request, response) {
	console.log("Render Login");

	var authorization = auth.CheckAuth(request);
	if (authorization) {
		response.redirect('/');
		return;
	}
	renderer.RenderLoginPage(request, response);
};

/* ********************
 * Handle get requests for /register
******************** */
function renderRegister(request, response) {
	console.log("Render Register");

	var authorization = auth.CheckAuth(request);
	if (authorization) {
		response.redirect('/');
		return;
	}
	renderer.RenderRegister(request, response);
};

/* ********************
 * Handle get requests for /buildings
******************** */
function renderBuildings(request, response) {
	console.log("Rendering buildings page");

	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	server.getBuildingsData(function(titles, buildingsData) {
		var cbData = {};
		var managerData = {}

		renderer.RenderContentPage("buildings", titles, buildingsData, request, response);
	});
};

/* ********************
 * Handle get requests for /locations
******************** */
function renderLocations(request, response) {
	console.log("Rendering locations page");

	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	server.getLocationsData(function(titles, locationsData) {
		renderer.RenderContentPage("locations", titles, locationsData, request, response);
	});
};

/* ********************
 * Handle get requests for /tools
******************** */
function renderTools(request, response) {
	console.log("Rendering tools page");

	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getToolsData(function(titles, toolsData) {
		renderer.RenderContentPage("tools", titles, toolsData, request, response);
	});
};

/* ********************
 * Handle get requests for /contains
 ******************** */
function renderContains(request, response) {
	console.log("Rendering contains page");

	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getContainsData(function(titles, containsData) {
		renderer.RenderContentPage("contains", titles, containsData, request, response);
	});
};

/* ********************
 * Handle get requests for /maintainers
******************** */
function renderMaintainers(request, response) {
	console.log("Rendering maintainers page");

	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getMaintainerData(function(titles, maintainersData) {
		renderer.RenderContentPage("maintainers", titles, maintainersData, request, response);
	});
};

/* ********************
 * Handle get requests for /logout
******************** */
function handleLogout(request, response) {
	console.log("Rendering logout page");

	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	// Remove the cookie
	response.clearCookie('site_auth');
	response.redirect('/');
};

/* ********************
 * Handle get requests for 
******************** */
function renderLocationsAndTools(request, response) {
	console.log("Rendering locations_and_tools page");

	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	server.getLocationsAndToolsData(function(accordionData) {
		renderer.RenderAccordionPage("locations_and_tools", accordionData, request, response);
	});
};

/* ********************
 * Handle get requests for 
******************** */
function renderBuildingsAndLocations(request, response) {
	console.log("Rendering buildings_and_locations page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	server.getBuildingsAndLocationsData(function(accordionData) {
		renderer.RenderAccordionPage("buildings_and_locations", accordionData, request, response);
	});
};

function routeHandler(route, request, response) {
	console.log("ROUTE: " + route);
	if (route == '/') {
		renderer.RenderHomePage(request, response);
	}
	for (var routeRegex in pageConfig) {
		var results = route.match(routeRegex);
		if (route.match(routeRegex) != null) {
			console.log("MATCHED: " + routeRegex);
			pageConfig[routeRegex](request, response);
		}
	}
};
