// data insertion grabbing from startingData.js
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const startingData = require("./startingData");

const db = new sqlite3.Database("./database.db");

// Function to insert users
async function insertUsers(users) {
  for (const user of users) {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO users (name, password, role_id) VALUES (?, ?, ?)`,
          [user.name, hash, user.role_id],
          function (err) {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  }
}

// Function to insert followers
async function insertFollowers(followers) {
  for (const follower of followers) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO followers (follower_id, followed_id) VALUES (?, ?)`,
        [follower.follower_id, follower.followed_id],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}

// Function to insert roles
async function insertRoles(roles) {
  for (const role of roles) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO roles (role_name) VALUES (?)`,
        [role.role_name],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}

// Function to insert posts
async function insertPosts(posts) {
  for (const post of posts) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO posts (content, user_id) VALUES (?, ?)`,
        [post.content, post.user_id],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}

// Function to insert comments
async function insertComments(comments) {
  for (const comment of comments) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`,
        [comment.post_id, comment.user_id, comment.content],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}

// Function to execute all the other functions
async function insertData() {
  await insertUsers(startingData.users);
  await insertFollowers(startingData.followers);
  await insertRoles(startingData.roles);
  await insertPosts(startingData.posts);
  await insertComments(startingData.comments);
}

// Inserting data
insertData()
  .then(() => {
    console.log("Data inserted!");
    db.close();
  })
  .catch((error) => {
    console.error("Error inserting data:", error);
    db.close();
  });
