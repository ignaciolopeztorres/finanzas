//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
    // Example: using express-session, set req.session.user on login
    if (req.session && req.session.user) {
       req.user = req.session.user;
       return next();
        //return redirect('/login');
    }

    return next(); // Temporarily allow all for testing
}
export { isAuthenticated };

