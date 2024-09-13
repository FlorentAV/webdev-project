const express = require('express');
const { engine } = require('express-handlebars');
const port = 3000;
const app = express();



app.engine('handlebars', engine());

app.set('view engine', 'handlebars');

// sets the path to the views
app.set('views', './views');


// patch to static public directory
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.render('home');
});


// Routes

//app.use('/', require('./routes/auth'));



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);


