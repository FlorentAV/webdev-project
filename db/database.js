const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const startingData = require('./startingData');



// create database file
const db = new sqlite3.Database('./database.db');


db.serialize(() => {
 // Creating usewrs table if not exists
 db.run(`DROP TABLE IF EXISTS users`, (err) => {
    if (err) {
        console.error('Error dropping users table:', err.message);
    }
});
db.run(`DROP TABLE IF EXISTS roles`, (err) => {
    if (err) {
        console.error('Error dropping roles table:', err.message);
    }
});


db.run(`CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE
)`);

db.run(`INSERT INTO roles (role_name) VALUES (?)`, ['admin']);
db.run(`INSERT INTO roles (role_name) VALUES (?)`, ['user']);
db.run(`INSERT INTO roles (role_name) VALUES (?)`, ['support']);
           
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password TEXT NOT NULL,
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
)`);
});


// Different functions for sql queries


const createUser = (name, password, callback) => {
    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        
        // Insert user into the database with the hashed password
        const sql = `INSERT INTO users (name, password, role_id) VALUES (?, ?, ?)`;
        db.run(sql, [name, hash, 2], function (err) {
            callback(err, this ? this.lastID : null);
        });
    });
};


// Login function
const loginUser = (name, password, callback) => {
    const sql = `SELECT * FROM users WHERE name = ?`;   // sql query to get username from users
    db.get(sql, [name], (err, user) => {  // get the user from the database
        if (err) {
            req.session.errorMessage = 'Error logging in';
            return callback(err); 
        }
        if (!user) {  // if user does not exist
            return callback(null, false); 
        }

        // make the comparison with bcrypt to compare the password typed in with the hashed
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                return callback(null, user); // if the password is matched, returns the user
            } else {
                return callback(null, false); // else if the password does not match
            }
        });

        
      
    });
};




// Inserting some example data 
startingData.users.forEach((user) => {
    bcrypt.hash(user.password, 10, (err, hash) => { // Hash the password from the stock data in startingData.js
        if (err) {
            console.error('Error hashing password:', err);
            return;
        }

        

            // Insert the user with the hashed password and role ID
            db.run(`INSERT INTO users (name, password, role_id) VALUES (?, ?, ?)`, [user.name, hash, user.role_id]);
        });
    });




module.exports = {
    createUser,
    loginUser 
};