// Authorization

var session = require('express-session');

module.exports = {
	InitializeSession: initializeSession,
	CheckAuth: checkAuth,
	CheckSession: checkSession,
};

function initializeSession(server) {
	server.use(
		session({
			key: 'site_auth',
			secret: 'somerandonstuffs',
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
function checkAuth(request) {
	if (request.cookies.site_auth) {
		return true;
	}
	return false;
}

/* ********************
 * Check if the user is authenticated and redirect them elsewhere if not
******************** */
function checkSession(req, res, next) {
	if (req.cookies.site_auth) {
		res.redirect('/');
	} else {
		next();
	}    
};
