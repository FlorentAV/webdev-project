// Route for user register and login
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const {
  showAllPosts,
  totalPosts,
  loginUser,
  createUser,
  getUserByUsername,
  changePassword,
  getUserPassword,
  banUser,
  findUserById,
  unbanUser,
  createComment,
  getComments,
  getAllUsers,
  getTotalUsers,
  deleteUser,
  followUser,
  unfollowUser,
  isFollowing,
  getFollowerCount,
  createPost,
  deletePost,
  findOwner,
} = require("../db/database.js");

// Route for settings page
router.get("/settings", isAuthenticated, (req, res) => {
  res.render("settings", {
    title: "Settings",
    page: "settings",
    successMessage: req.session.successMessage,
    errorMessage: req.session.errorMessage,
    user: req.session.user,
  });
  delete req.session.successMessage;
  delete req.session.errorMessage;
});

// Route to delete a user
router.post("/delete-user", isAuthenticated, isAdmin, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await findUserById(userId);
    if (!user) {
      req.session.errorMessage =
        "Cannot delete something that is already probably deleted, or never existed in the first place.";
      return res.redirect("back");
    }

    if (user.role_id !== 1) {
      await deleteUser(userId);
      req.session.successMessage = "Right in the trashbin!";
    } else {
      req.session.errorMessage =
        "Sorry but deleting an Admin would mean the end of this site!";
    }
    res.redirect("back");
  } catch (error) {
    req.session.errorMessage = "Error deleting user";
    res.redirect("back");
  }
});

// Route to display user list for admins
router.get("/userlist", isAuthenticated, isAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const usersPerPage = 10;

  try {
    const users = await getAllUsers(page, usersPerPage);
    const totalUsers = await getTotalUsers();
    const totalPages = Math.ceil(totalUsers / usersPerPage);

    res.render("userlist", {
      title: "User List",
      users,
      page: "userlist",
      user: req.session.user,
      currentPage: page,
      totalPages,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage,
    });
  } catch (error) {
    req.session.errorMessage = "Error loading user list";
    res.redirect("back");
  }

  delete req.session.successMessage;
  delete req.session.errorMessage;
});

// Route for profile viewing
router.get(
  ["/profile/:username", "/profile"],
  isAuthenticated,
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const username = req.params.username || req.session.user.name;

    try {
      const profileUser = await getUserByUsername(username);
      const userId = profileUser.id;
      const isOwner =
        req.session.user.name.toLowerCase() === username.toLowerCase();
      const userFollowing = await isFollowing(
        req.session.user.id,
        profileUser.id
      );
      const posts = await showAllPosts(page, userId);
      const followerCount = await getFollowerCount(profileUser.id);

      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          post.comments = await getComments(post.id);
          return post;
        })
      );

      const total = await totalPosts(userId);
      const totalPages = Math.ceil(total / 10);

      res.render("profile", {
        title: `${profileUser.name}'s Profile`,
        page: "profile",
        profileUser,
        followerCount,
        isFollowing: userFollowing,
        user: req.session.user,
        posts: postsWithComments,
        totalPages,
        currentPage: page,
        isOwner,
        successMessage: req.session.successMessage,
        errorMessage: req.session.errorMessage,
      });
    } catch (error) {
      req.session.errorMessage = "Error retrieving profile or posts";
      res.redirect("/profile");
    }

    delete req.session.successMessage;
    delete req.session.errorMessage;
  }
);

// Route to ban a user
router.post("/ban-user", isAuthenticated, isAdmin, async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await findUserById(userId);
    if (!user) {
      req.session.errorMessage = "Nah there are no one to even ban here!";
      res.redirect(req.headers.referer);
    }

    if (user.role_id === 1) {
      req.session.errorMessage =
        "What do you mean banning an Admin? That is illegal in our community!";
        res.redirect(req.headers.referer);
    }

    await banUser(userId);
    req.session.successMessage = "GET OUT OF HERE! USER IS NOW BANNED!";
    res.redirect(req.headers.referer);
  } catch (error) {
    req.session.errorMessage = "Error banning user";
    res.redirect(req.headers.referer);
  }
});

// Route to unban a user
router.post("/unban-user", isAuthenticated, isAdmin, async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await findUserById(userId);
    if (!user) {
      req.session.errorMessage = "You cannot ban a ghost, I am sorry.";
      res.redirect(req.headers.referer);
    }

    if (user.role_id === 1) {
      req.session.errorMessage =
        "How did even an admin get banned in the first place?";
        res.redirect(req.headers.referer);
    }

    await unbanUser(userId);
    req.session.successMessage =
      "Are you sure this was a good idea? Well the user is unbanned anyway.";
        res.redirect(req.headers.referer);
  } catch (error) {
    req.session.errorMessage = "Error unbanning user";
    res.redirect(req.headers.referer);
  }
});

router.post("/posts", isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const content = req.body.content;

  if (!content || content.trim() === "") {
    req.session.errorMessage = "The content cannot be empty!";
    res.redirect(req.headers.referer);
  }

  try {
    await createPost(content, userId);
    req.session.successMessage =
      "Your post about your boring life has been posted!";
  } catch (error) {
    console.error("Error creating post:", error);
    req.session.errorMessage = "Error creating post";
  }
  res.redirect(req.headers.referer);
});

// Route to post a comment
router.post("/post-comment", isAuthenticated, async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.session.user.id;

  if (!content || content.trim() === "") {
    req.session.errorMessage = "No empty comment, brother!";
    res.redirect(req.headers.referer);
  }

  try {
    await createComment(postId, userId, content);
    req.session.successMessage = "Comment posted, LETS GO!";
    res.redirect(req.headers.referer);
  } catch (error) {
    req.session.errorMessage = "Error creating comment";
    res.redirect(req.headers.referer);
  }
});

// Delete a post by ID
router.post("/delete-post/:id", isAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const userId = req.session.user.id;
  
    try {
      const ownerId = await findOwner(postId);
  
      if (req.session.user.role_id !== 1 && userId !== ownerId) {
        return res.status(403).send("Hey, you are not the owner of this post!");
      }
  
      await deletePost(postId);
      req.session.successMessage = "Bye bye, post!";
    } catch (error) {
      req.session.errorMessage = "Error deleting post";
    }
    res.redirect(req.headers.referer);
  });

// Registration route
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  try {
    await createUser(name, password);
    req.session.successMessage =
      "WELCOME TO THE BEST WEBSITE EVER, YOU NOW HAVE AN ACCOUNT!";
    res.redirect("/login");
  } catch (error) {
    req.session.errorMessage =
      "Sorry but that username is taken, get another one!";
    res.redirect("/signup");
  }
});

// Password change route
router.post("/change-password", isAuthenticated, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.session.user.id;

  try {
    const hashedPassword = await getUserPassword(userId);
    const isCorrect = await bcrypt.compare(oldPassword, hashedPassword);

    if (!isCorrect) {
      req.session.errorMessage =
        "Hey, your old password is not matching! Are you real?";
      return res.redirect("/settings");
    }

    await changePassword(userId, newPassword);
    req.session.successMessage =
      "Okey, your password has been changed, now remember it please next time...";
    res.redirect("/settings");
  } catch (error) {
    req.session.errorMessage = "Error changing password";
    res.redirect("/settings");
  }
});

// Admin password change route
router.post(
  "/change-user-password",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
      await changePassword(userId, newPassword);
      req.session.successMessage = "Password is changed, mr Admin!";
      res.redirect("/userlist");
    } catch (error) {
      req.session.errorMessage = "Error changing password";
      res.redirect("/userlist");
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  const { name, password, remember } = req.body;

  try {
    const user = await loginUser(name, password);

    if (!user) {
      req.session.errorMessage =
        "Come on, remember your password or username next time!";
      return res.redirect("/login");
    }

    if (user.isBanned) {
      req.session.errorMessage = "To sad, you are actually banned! XD.";
      return res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role_id: user.role_id,
      isBanned: user.isBanned,
    };

    if (remember) {
      res.cookie("userId", user.id, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    }

    req.session.successMessage = "There you go! You are now logged in!";
    res.redirect("/");
  } catch (error) {
    req.session.errorMessage = "Error logging in. Please try again later.";
    res.redirect("/login");
  }
});

// Follow route
router.post("/follow", isAuthenticated, async (req, res) => {
  const followedId = req.body.followedId;
  const followerId = req.session.user.id;

  try {
    await followUser(followerId, followedId);
    req.session.successMessage = "YAY! YOU ARE NOW FOLLOWING THIS UNKOWN USER!";
    res.redirect(req.headers.referer);
  } catch (error) {
    req.session.errorMessage = "Failed to follow user!";
    res.redirect(req.headers.referer);
  }
});

// Unfollow route
router.post("/unfollow", isAuthenticated, async (req, res) => {
  const followedId = req.body.followedId;
  const followerId = req.session.user.id;
  try {
    await unfollowUser(followerId, followedId);
    req.session.successMessage =
      "Well, you have now unfollowed this user, why so?";
      res.redirect(req.headers.referer);
  } catch (error) {
    req.session.errorMessage = "Failed to unfollow user!";
    res.redirect(req.headers.referer);
  }
});

module.exports = router; // Exporting the router to use in server.js
