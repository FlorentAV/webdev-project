const { findUserById } = require("../db/database.js");

const isAuthenticated = (req, res, next) => {
    
    if (req.session.user) {
        console.log("is banned = " + req.session.user.isBanned)
            if(req.session.user.isBanned === 1) {
                req.session.errorMessage = 'You are banned!';
                return res.redirect('/banned');
            }
            return next();
        }
        // User is authenticated, proceed to the next middleware or route
        
     else {
        // User is not authenticated, redirect to login page
        return res.redirect('/login');
    }
}

const isAdmin = (req, res, next) => {

    if(req.session.user.role_id === 1) {
        return next();
    } else {
        req.session.errorMessage = 'You do not have permission!';
        return res.redirect('/');
    }

}


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
    isLoggedIn,
    isAdmin
};