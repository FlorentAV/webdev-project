const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // User is authenticated, proceed to the next middleware or route
        return next();
    } else {
        // User is not authenticated, redirect to login page
        return res.redirect('/login');
    }
};

const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        // User is logged in, redirect to home
        return res.redirect('/');
    }
    // User is not logged in, proceed to the next middleware
    next();
};
module.exports = {
    isAuthenticated,
    isLoggedIn
};