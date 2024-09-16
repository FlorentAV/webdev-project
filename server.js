const express = require('express');
const { engine } = require('express-handlebars');
const session   = require('express-session');
const helpers = require('./helpers/handlebars-helpers');
require('dotenv').config();
const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({
    helpers: helpers,
}));

app.set('view engine', 'handlebars')

// sets the path to the views
app.set('views', './views');


// patch to static public directory
app.use(express.static('public'));



// Session to keep the user logged in
app.use(session({
    secret: process.env.SESSION_SECRET, // secret key stored in .env file
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



// Routes
app.use('/', require('./routes/home'));
app.use('/', require('./routes/users'));

// Takes care of 404 errors
app.use((req, res, next) => {
    res.status(404);
    res.render('error', { message: 'Page not found (404)' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


