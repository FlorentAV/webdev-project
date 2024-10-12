const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  isLoggedIn,
} = require("../middlewares/authMiddleware");
const {
  showAllPosts,
  totalPosts,
  getComments,
} = require("../db/database.js");

// Home page with paginated posts and comments
router.get("/", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  try {
    const posts = await showAllPosts(page);
    const postsWithComments = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        comments: await getComments(post.id),
      }))
    );

    const total = await totalPosts();
    const totalPages = Math.ceil(total / 10);

    res.render("home", {
      title: "Home",
      page: "home",
      user: req.session.user,
      posts: postsWithComments,
      totalPages,
      currentPage: page,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage,
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    req.session.errorMessage = "Error retrieving posts or comments";
    res.redirect("/profile");
  }
});

// Route for signing up
router.get("/signup", isLoggedIn, (req, res) => {
  res.render("signup", {
    title: "Signup",
    user: req.session.user,
    page: "signup",
    successMessage: req.session.successMessage,
    errorMessage: req.session.errorMessage,
  });
});

// Route for logout
router.get("/logout", isAuthenticated, (req, res) => {
  req.session.destroy();
  res.clearCookie("userId");
  res.redirect("/");
});

// Route for login page
router.get("/login", isLoggedIn, (req, res) => {
  res.render("login", {
    title: "Login",
    page: "login",
    successMessage: req.session.successMessage,
    errorMessage: req.session.errorMessage,
  });
  delete req.session.successMessage;
  delete req.session.errorMessage;
});


// About page
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    user: req.session.user,
    page: "about",
  });
});

// Banned user page
router.get("/banned", isLoggedIn, (req, res) => {
  const errorMessage =
    req.session.errorMessage;
  delete req.session.errorMessage;
  req.session.destroy();
  res.clearCookie("userId");
  res.render("banned", {
    title: "Banned",
    errorMessage,
  });
});



module.exports = router;
