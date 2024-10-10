const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
require('./dataInsert');

// create database file
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS users`);
    db.run(`DROP TABLE IF EXISTS followers`);
    db.run(`DROP TABLE IF EXISTS posts`);
    db.run(`DROP TABLE IF EXISTS comments`);
    db.run(`CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_name TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password TEXT NOT NULL,
        dateJoined DATETIME DEFAULT CURRENT_TIMESTAMP,
        isBanned INTEGER DEFAULT 0,
        role_id INTEGER,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (follower_id, followed_id)  -- Ensures that a user cannot follow another user more than once
    )`);
});

// Functions for SQL queries
async function createComment(postId, userId, content) {
    const sql = `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [postId, userId, content], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

async function getComments(postId) {
    const sql = `SELECT c.*, u.name AS user_name FROM comments c
                 JOIN users u ON c.user_id = u.id
                 WHERE c.post_id = ? ORDER BY c.created_at DESC`;
    return new Promise((resolve, reject) => {
        db.all(sql, [postId], (err, comments) => {
            if (err) reject(err);
            else resolve(comments);
        });
    });
}

async function followUser(followerId, followedId) {
    const sql = 'INSERT INTO followers (follower_id, followed_id) VALUES (?, ?) RETURNING *';

    return new Promise((resolve, reject) => {
        db.run(sql, [followerId, followedId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID); // You can return the ID of the new follower relationship if needed
            }
        });
    });
}

async function unfollowUser(followerId, followedId) {
    const sql = 'DELETE FROM followers WHERE follower_id = ? AND followed_id = ?';

    return new Promise((resolve, reject) => {
        db.run(sql, [followerId, followedId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(); // No return value needed
            }
        });
    });
}

async function getFollowerCount(userId) {
    const sql = 'SELECT COUNT(*) as count FROM followers WHERE followed_id = ?';

    return new Promise((resolve, reject) => {
        db.get(sql, [userId], (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
}

async function isFollowing(followerId, followedId) {
    const sql = 'SELECT COUNT(*) as count FROM followers WHERE follower_id = ? AND followed_id = ?';

    return new Promise((resolve, reject) => {
        db.get(sql, [followerId, followedId], (err, row) => {
            if (err) reject(err);
            else resolve(row.count > 0); // Return true if count is greater than 0
        });
    });
}

async function getTotalUsers() {
    const sql = 'SELECT COUNT(*) AS count FROM users';
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
}

async function getAllUsers(page, usersPerPage) {
    const offset = (page - 1) * usersPerPage;
    const sql = `SELECT u.*, r.role_name FROM users u
                 JOIN roles r ON u.role_id = r.id
                 LIMIT ? OFFSET ?`;
    return new Promise((resolve, reject) => {
        db.all(sql, [usersPerPage, offset], (err, users) => {
            if (err) reject(err);
            else resolve(users);
        });
    });
}

async function deleteUser(userId) {
    const sql = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [userId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function createUser(name, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, password, role_id) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [name, hashedPassword, 2], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

async function createPost(content, user_id) {
    const sql = `INSERT INTO posts (content, user_id) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [content, user_id], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

async function showAllPosts(page = 1, userId = null) {
    const limit = 10;
    const offset = (page - 1) * limit;
    let sql = `SELECT posts.*, users.name, users.isBanned 
               FROM posts 
               JOIN users ON posts.user_id = users.id 
               ORDER BY posts.timestamp DESC 
               LIMIT ? OFFSET ?`;
    let params = [limit, offset];

    if (userId) {
        sql = `SELECT posts.*, users.name, users.isBanned 
               FROM posts 
               JOIN users ON posts.user_id = users.id 
               WHERE posts.user_id = ? 
               ORDER BY posts.timestamp DESC 
               LIMIT ? OFFSET ?`;
        params = [userId, limit, offset];
    }
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function totalPosts(userId = null) {
    let sql = `SELECT COUNT(*) AS total FROM posts`;
    const params = [];
    if (userId) {
        sql += ` WHERE user_id = ?`;
        params.push(userId);
    }
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result.total);
        });
    });
}

async function deletePost(postId) {
    const sql = `DELETE FROM posts WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [postId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function findOwner(postId) {
    const sql = `SELECT user_id FROM posts WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [postId], (err, row) => {
            if (err) reject(err);
            else resolve(row.user_id);
        });
    });
}

async function banUser(userId) {
    const sql = `UPDATE users SET isBanned = 1 WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [userId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function unbanUser(userId) {
    const sql = `UPDATE users SET isBanned = 0 WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [userId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function changePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = `UPDATE users SET password = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [hashedPassword, userId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function getUserPassword(userId) {
    const sql = `SELECT password FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [userId], (err, row) => {
            if (err || !row) reject(err || new Error('User not found'));
            else resolve(row.password);
        });
    });
}

async function findUserById(userId) {
    const sql = `SELECT id, name, role_id, isBanned FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [userId], (err, user) => {
            if (err) reject(err);
            else resolve(user || null);
        });
    });
}

async function getUserByUsername(username) {
    const sql = `SELECT id, name, dateJoined, isBanned, role_id FROM users WHERE name = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [username], (err, user) => {
            if (err || !user) reject(err || new Error('User not found'));
            else resolve(user);
        });
    });
}

async function loginUser(name, password) {
    const sql = `SELECT * FROM users WHERE name = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [name], async (err, user) => {
            if (err || !user) return reject(err || new Error('User not found'));
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) resolve(user);
            else resolve(null);
        });
    });
}




module.exports = {
    createUser,
    loginUser,
    createPost,
    showAllPosts,
    deletePost,
    totalPosts,
    getAllUsers,
    findUserById,
    createComment,
    getComments,
    deleteUser,
    getTotalUsers,
    findOwner,
    changePassword,
    getUserPassword,
    banUser,
    unbanUser,
    getUserByUsername,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowerCount,
};
