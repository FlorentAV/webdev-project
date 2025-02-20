const express = require('express');
const { engine } = require('express-handlebars');
const session   = require('express-session');
const cookieParser = require('cookie-parser');
const helpers = require('./helpers/handlebars-helpers');
const { findUserById } = require('./db/database.js');

require('dotenv').config();
const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.engine('handlebars', engine({
    helpers: helpers,
}));

app.set('view engine', 'handlebars')

// sets the path to the views
app.set('views', './views');


// patch to static public directory
app.use(express.static('public'));



/*
Code generated by ChatGPT - BEGIN
(ChatGPT, 2024, "How to keep the user logged in if they ticked in "Remember me" box ",
https://chatgpt.com/)
*/
// Session to keep the user logged in and keep user logged in if remember me is chosen
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
}));



app.use(async (req, res, next) => {
    if (req.cookies.userId && !req.session.user) {
        
        const userId = req.cookies.userId;

        try {
            
            const user = await findUserById(userId);

            if (user) {
                req.session.user = user; 
            }
        } catch (err) {
            console.error('Error retrieving user:', err);
           
        }
    }
    next(); 
});



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


