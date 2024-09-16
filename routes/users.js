// Route for user register and login
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const db = require('../db/database.js');
const { isLoggedIn, isAuthenticated } = require('../middlewares/authMiddleware');






// Get requests for the handlebars

router.get('/signup', isLoggedIn, (req, res) => {
    res.render('signup', { title: 'Signup', user: req.session.user, page: 'signup' });
});

router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/login', isLoggedIn, (req, res) => {
    res.render('login', { title: 'Login', page: 'login', successMessage: req.session.successMessage });
    delete req.session.successMessage; // Delete the sucessMessage so it only appears once when you successfully login
    
});



router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { title: 'Profile', user: req.session.user, page: 'profile' });
});

// Post requests for signing up and logging in
router.post('/register', (req, res) => {
    const { name, password } = req.body;

    // Call createUser and let it handle hashing and database insertion
    db.createUser(name, password, (err, userId) => {
        if (err) {
            req.session.errorMessage = 'Username already exists';
            return res.render('signup', { errorMessage: req.session.errorMessage })
        }
        req.session.successMessage = 'Singup successful!';
        res.redirect('/login'); // Redirect to login after signup
    });
});

// Login
router.post('/login', (req, res) => {
    const { name, password } = req.body;

    // Call loginUser to authenticate the user
    db.loginUser(name, password, (err, user) => {
        if (err) {
            req.session.errorMessage = 'Error logging in';
            return res.render('login', { errorMessage: req.session.errorMessage });
        }
        if (!user) {
            req.session.errorMessage = 'Invalid username or password';  // Display error message when incorrectly typed in wrong credentials
            return res.render('login', { errorMessage: req.session.errorMessage });
        }


        req.session.user = {
            id: user.id,
            name: user.name,
            role_id: user.role_id
        };
        req.session.successMessage = 'Login successful!';

        res.redirect('/');
    });
});

module.exports = router; // Exporting the router to use in server.js