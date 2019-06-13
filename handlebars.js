// Handlebars Renderer

module.exports = {
	RenderHomePage: renderHomePage,
	RenderLoginPage: renderLoginPage,
	RenderRegisterPage: renderRegisterPage,
	RenderAccordionPage: renderAccordionPage,
	RenderContentPage: renderContentPage,
	Render404Page: render404Page
};

/* ********************
 * Render the home page
******************** */
function renderHomePage(request, response) {
	console.log("Rendering home page");
	var authorization = checkAuth(request);
	var templateArgs = {
		title: "Tools DB - Home",
		nav_title: "Tools DB",
		active: "home",
		loggedIn: authorization,
		loadCss: [
			{filename: "index.css"},
			{filename: "home.css"},
		],
		loadJs: [
			{filename: "index.js"},
		],
	};
	response.render('homePage', templateArgs);
};

/* ********************
 * Render the login page
******************** */
function renderLoginPage(request, response) {
	console.log("Rendering login page");
	var templateArgs = {
		title: "Tools DB - Login",
		nav_title: "Tools DB",
		active: "login",
		login: true,
		loadCss: [
			{filename: "index.css"},
			{filename: "login.css"},
			{filename: "status.css"},
		],
		loadJs: [
			{filename: "index.js"},
			{filename: "login.js"}
		],
	};
	response.render('loginPage', templateArgs);
};

/* ********************
 * Render the register page
******************** */
function renderRegisterPage(request, response) {
	console.log("Rendering register page");
	var templateArgs = {
		title: "Tools DB - Register",
		nav_title: "Tools DB",
		active: "register",
		login: true,
		loadCss: [
			{filename: "index.css"},
			{filename: "login.css"},
			{filename: "status.css"},
		],
		loadJs: [
			{filename: "index.js"},
			{filename: "register.js"}
		],
	};
	response.render('loginPage', templateArgs);
};


/* ********************
 * Render the accordion content page
******************** */
function renderAccordionPage(page, data, request, response) {
	console.log("Rendering accordion page: " + page);
	var authorization = checkAuth(request);
	if (page == "locations_and_tools") {
		var templateArgs = {
			title: "Locations and Tools",
			nav_title: "Tools DB",
			loggedIn: authorization,
			active: "locations_and_tools",
			loadCss: [
				{filename: "index.css"},
				{filename: "accordion.css"},
			],
			loadJs: [
				{filename: "index.js"},
				{filename: "accordion.js"},
			],
			accordionData: data,
		};
		response.render('accordionPage', templateArgs);
	} else if (page == "buildings_and_locations") {
		var templateArgs = {
			title: "Buildings and Locations",
			nav_title: "Tools DB",
			loggedIn: authorization,
			active: "buildings_and_locations",
			loadCss: [
				{filename: "index.css"},
				{filename: "accordion.css"},
			],
			loadJs: [
				{filename: "index.js"},
				{filename: "accordion.js"},
			],
			accordionData: data,
		};
		response.render('accordionPage', templateArgs);
	}
};


/* ********************
 * Render any content page
******************** */
function renderContentPage(page, titles, data, request, response) {
	console.log("Rendering content page: " + page);
	var authorization = checkAuth(request);
	if (page == "buildings") {
		var query = sql.format('SELECT email FROM User WHERE 1');
		console.log("QUERY: " + query);
		connection.query(query, function (error, results, fields) {
			if (error) {
				console.log("ERROR: " + error);
				return;
			}
			convertSelectResultsToArray(results, function(cbDataArray) {
				var templateArgs = {
					title: "Buildings",
					nav_title: "Tools DB",
					loggedIn: authorization,
					active: "buildings",
					loadCss: [
						{filename: "index.css"},
						{filename: "contentPage.css"},
						{filename: "modal.css"},
						{filename: "status.css"},
					],
					loadJs: [
						{filename: "index.js"},
						{filename: "modal.js"},
						{filename: "content.js"},
					],
					header: titles,
					item: data,
					modalHeader: "Add New Building",
					modalType: "buildings",
					modalContentRow: [
						{
							inputType: "text",
							placeholder: "Address",
							name: "address",
							required: true,
						},
						{
							inputType: "text",
							placeholder: "Name",
							name: "name",
							required: true,
						},
						{
							inputType: "combobox",
							label: "Manager",
							name: "manager",
							cbData: cbDataArray,
						},
					],
				};
				response.render('contentPage', templateArgs);
			});
		});
	} else if (page == "locations") {
		var query = sql.format('SELECT address FROM Building WHERE 1');
		console.log("QUERY: " + query);
		connection.query(query, function (error, results, fields) {
			if (error) {
				console.log("ERROR: " + error);
				return;
			}
			convertSelectResultsToArray(results, function(cbDataArray) {
				var templateArgs = {
					title: "Locations",
					nav_title: "Tools DB",
					loggedIn: authorization,
					active: "locations",
					loadCss: [
						{filename: "index.css"},
						{filename: "contentPage.css"},
						{filename: "modal.css"},
						{filename: "status.css"},
					],
					loadJs: [
						{filename: "index.js"},
						{filename: "modal.js"},
						{filename: "content.js"},
					],
					header: titles,
					item: data,
					modalHeader: "Add New Location",
					modalType: "locations",
					modalContentRow: [
						{
							inputType: "text",
							placeholder: "ID",
							name: "ID",
							required: true,
						},
						{
							inputType: "combobox",
							label: "Address",
							name: "address",
							cbData: cbDataArray,
						},
						{
							inputType: "text",
							placeholder: "Name",
							name: "name",
							required: true,
						},
					],
				};
				response.render('contentPage', templateArgs);
			});
		});
	} else if (page == "tools") {
		var query = sql.format('SELECT name FROM `Maintenance Company` WHERE 1');
		console.log("QUERY: " + query);
		connection.query(query, function (error, results, fields) {
			if (error) {
				console.log("ERROR: " + error);
				return;
			}
			convertSelectResultsToArray(results, function(maintainerCbDataArray) {
				query = sql.format('SELECT ID FROM Location WHERE 1');
				console.log("QUERY: " + query);
				connection.query(query, function (error, results, fields) {
					if (error) {
						console.log("ERROR: " + error);
						return;
					}
					convertSelectResultsToArray(results, function(locationCbDataArray) {
						var templateArgs = {
							title: "Tools",
							nav_title: "Tools DB",
							loggedIn: authorization,
							active: "tools",
							loadCss: [
								{filename: "index.css"},
								{filename: "contentPage.css"},
								{filename: "modal.css"},
								{filename: "status.css"},
							],
							loadJs: [
								{filename: "index.js"},
								{filename: "modal.js"},
								{filename: "content.js"},
							],
							header: titles,
							item: data,
							modalHeader: "Add New Tool",
							modalType: "tools",
							modalContentRow: [
								{
									inputType: "text",
									placeholder: "TID",
									name: "tid",
									required: true,
								},
								{
									inputType: "text",
									placeholder: "Name",
									name: "name",
									required: true,
								},
								{
									inputType: "combobox",
									label: "Maintenance Company",
									name: "maintainer",
									cbData: maintainerCbDataArray,
								},
								{
									inputType: "combobox",
									label: "Location",
									name: "location",
									cbData: locationCbDataArray,
								},
							],
						};
						response.render('contentPage', templateArgs);
					});
				});
			});
		});
	} else if (page == "contains") {
		var query = sql.format('SELECT tid FROM Tool WHERE 1');
		console.log("QUERY: " + query);
		connection.query(query, function (error, results, fields) {
			if (error) {
				console.log("ERROR: " + error);
				return;
			}
			convertSelectResultsToArray(results, function(toolCbDataArray) {
				query = sql.format('SELECT ID FROM Location WHERE 1');
				console.log("QUERY: " + query);
				connection.query(query, function (error, results, fields) {
					if (error) {
						console.log("ERROR: " + error);
						return;
					}
					convertSelectResultsToArray(results, function(locationCbDataArray) {
						var templateArgs = {
							title: "Contains",
							nav_title: "Tools DB",
							loggedIn: authorization,
							active: "contains",
							loadCss: [
								{filename: "index.css"},
								{filename: "contentPage.css"},
								{filename: "modal.css"},
								{filename: "status.css"},
							],
							loadJs: [
								{filename: "index.js"},
								{filename: "modal.js"},
								{filename: "content.js"},
							],
							header: titles,
							item: data,
							modalHeader: "Add New Relation",
							modalType: "contains",
							modalContentRow: [
								{
									inputType: "combobox",
									label: "Location ID",
									name: "lid",
									cbData: locationCbDataArray,
								},
								{
									inputType: "combobox",
									label: "Tool",
									name: "tid",
									cbData: toolCbDataArray,
								},
							],
						};
						response.render('contentPage', templateArgs);
					});
				});
			});
		});
	} else if (page == "maintainers") {
		var templateArgs = {
			title: "Maintenance Company",
			nav_title: "Tools DB",
			loggedIn: authorization,
			active: "maintainers",
			loadCss: [
				{filename: "index.css"},
				{filename: "contentPage.css"},
				{filename: "modal.css"},
				{filename: "status.css"},
			],
			loadJs: [
				{filename: "index.js"},
				{filename: "modal.js"},
				{filename: "content.js"},
			],
			header: titles,
			item: data,
			modalHeader: "Add New Maintenance Company",
			modalType: "maintainers",
			modalContentRow: [
				{
					inputType: "text",
					placeholder: "Business Name",
					name: "name",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Phone Number",
					name: "phone",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "E-Mail",
					name: "email",
					required: true,
				},
			],
		};
		response.render('contentPage', templateArgs);
	}
};

/* ********************
 * Render the 404 page
******************** */
function render404Page(request, response) {
	response.render('404Page');
};
