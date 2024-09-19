const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/database");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  createPost,
  showAllPosts,
  deletePost,
  totalPosts,
} = require("../db/database.js");

router.get("/", isAuthenticated, (req, res) => {
  res.render("home", {
    title: "Home",
    user: req.session.user,
    page: "home",
    successMessage: req.session.successMessage,
  });
  delete req.session.successMessage; // Delete the sucessMessage so it only appears once when you successfully login
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
    user: req.session.user,
    page: "contact",
  });
});

router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    user: req.session.user,
    page: "about",
  });
});

router.get("/posts", isAuthenticated, (req, res) => {
  const page = parseInt(req.query.page) || 1;

  showAllPosts(page, (err, posts) => {
    if (err) {
      req.session.errorMessage = "Error retrieving posts";
      return res.render("posts", { errorMessage: req.session.errorMessage });
    }

    totalPosts((err, total) => {
      if (err) {
        req.session.errorMessage = "Error counting posts";
        return res.render("posts", { errorMessage: req.session.errorMessage });
      }

      const totalPages = Math.ceil(total / 10);

      res.render("posts", {
        title: "Posts",
        user: req.session.user,
        page: "posts",
        posts: posts,
        totalPages,
        currentPage: page,
      });
    });
  });
});

router.post("/posts", (req, res) => {
  const userId = req.session.user.id;
  const content = req.body.content;

  if (!content || content.trim() === "") {
    req.session.errorMessage = "The content can not be empty!";
    return res.render("posts", { errorMessage: req.session.errorMessage });
  }

  createPost(content, userId, (post) => {
    req.session.successMessage = "Posted!";
    res.redirect('back');
  });
});

router.post("/delete-post/:id", (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user.id;

  deletePost(postId, userId, (err) => {
    if (err) {
      req.session.errorMessage = "Error deleting post";
      return res.render("posts");
    }

    req.session.successMessage = "Post deleted!";
    res.redirect('back');
  });
});

module.exports = router;
