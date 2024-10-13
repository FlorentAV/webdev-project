// Middlewares for authentication


// Logged in users
const isAuthenticated = (req, res, next) => {
    
    if (req.session.user) {
            if(req.session.user.isBanned === 1) {
                req.session.errorMessage = 'You are banned!';
                return res.redirect('/banned');
            }
            return next();
        }
        
     else {
        return res.redirect('/login');
    }
}

// Check if user is Admin
const isAdmin = (req, res, next) => {

    if(req.session.user.role_id === 1) {
        return next();
    } else {
        req.session.errorMessage = 'You do not have permission!';
        return res.redirect(req.headers.referer);
    }

}

const isSupport = (req, res, next) => {

    if(req.session.user.role_id === 3 || req.session.user.role_id === 1) {
        return next();
    } else {
        req.session.errorMessage = 'You do not have permission!';
        return res.redirect(req.headers.referer);
    }

}

// Used for checking if user is logged in (if they try to go to login page or register while logged in)
const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        
        return res.redirect('/');
    }
    
    next();
};

module.exports = {
    isAuthenticated,
    isLoggedIn,
    isAdmin,
    isSupport
};