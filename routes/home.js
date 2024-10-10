const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  createPost,
  showAllPosts,
  deletePost,
  totalPosts,
  findOwner,
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

// Contact page
router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
    user: req.session.user,
    page: "contact",
  });
});

// About page
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    user: req.session.user,
    page: "about",
  });
});

// Create a new post
router.post("/posts", isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const content = req.body.content;

  if (!content || content.trim() === "") {
    req.session.errorMessage = "The content cannot be empty!";
    return res.redirect("back");
  }

  try {
    await createPost(content, userId);
    req.session.successMessage = "Posted!";
  } catch (error) {
    req.session.errorMessage = "Error creating post";
  }
  res.redirect("back");
});

// Banned user page
router.get("/banned", (req, res) => {
  const errorMessage = req.session.errorMessage || "You are banned from this platform.";
  delete req.session.errorMessage;
  req.session.destroy();
  res.clearCookie("userId");
  res.render("banned", {
    title: "Banned",
    errorMessage,
  });
});

// Delete a post by ID
router.post("/delete-post/:id", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user.id;

  try {
    const ownerId = await findOwner(postId);

    if (req.session.user.role_id !== 1 && userId !== ownerId) {
      return res.status(403).send("Permission denied");
    }

    await deletePost(postId);
    req.session.successMessage = "Post deleted!";
  } catch (error) {
    req.session.errorMessage = "Error deleting post";
  }
  res.redirect("back");
});

module.exports = router;
