// Authorization

var session = require('express-session');
var bcrypt = require('bcrypt');

module.exports = {
	InitializeSession: initializeSession,
	CheckAuth: checkAuth,
};

function initializeSession(server) {
	server.use(
		session({
			key: 'site_session',
			secret: "randomness",
			resave: false,
			saveUninitialized: false,
			cookie: {
				expires: 600000
			}
		})
	);
};

/* ********************
 * Check if the user is authenticated
******************** */
function checkAuth(request, contents) {
	console.log("Checking auth");
	//console.log(request.session);
	console.log("Random value");
	console.log(request.session.rd);
	console.log("User");
	console.log(request.session.user);

	if (request.cookies.auth) {
		console.log("Cookie is:");
		console.log(request.cookies.auth);
		var cookieVal = Buffer.from(request.cookies.auth, 'base64').toString('ascii');
		console.log("Cookie value:");
		console.log(cookieVal);
		var toHash = request.session.user + request.session.rd + "";
		bcrypt.compare(toHash, cookieVal, function(err, res) {
			console.log("Results of bcrypt compare:");
			console.log(res);
			// Callback contents
			contents(res);
		});
	} else {
		// Callback contents
		contents(false);
	}
}
