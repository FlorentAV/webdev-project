const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database');
const { isAuthenticated } = require('../middlewares/authMiddleware');




router.get('/', isAuthenticated, (req, res) => {
    res.render('home', { title: 'Home', user: req.session.user, page: 'home', successMessage: req.session.successMessage  });
    delete req.session.successMessage; // Delete the sucessMessage so it only appears once when you successfully login
    
});


router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact', user: req.session.user, page: 'contact' });
    
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About', user: req.session.user, page: 'about' });
});


module.exports = router;