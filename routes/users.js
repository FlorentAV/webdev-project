// Route for user register and login
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {
    isLoggedIn,
    isAuthenticated,
    isAdmin
} = require('../middlewares/authMiddleware');
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
} = require("../db/database.js");

// Route for the signup page
router.get('/signup', isLoggedIn, (req, res) => {
    res.render('signup', {
        title: 'Signup',
        user: req.session.user,
        page: 'signup',
        successMessage: req.session.successMessage,
        errorMessage: req.session.errorMessage
    });
});

// Route for logout
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy();
    res.clearCookie('userId');
    res.redirect('/');
});

// Route for login page
router.get('/login', isLoggedIn, (req, res) => {
    res.render('login', {
        title: 'Login',
        page: 'login',
        successMessage: req.session.successMessage,
        errorMessage: req.session.errorMessage
    });
    delete req.session.successMessage;
    delete req.session.errorMessage;
});

// Route for settings page
router.get('/settings', isAuthenticated, (req, res) => {
    res.render('settings', {
        title: 'Settings',
        page: 'settings',
        successMessage: req.session.successMessage,
        errorMessage: req.session.errorMessage,
        user: req.session.user,
    });
    delete req.session.successMessage;
    delete req.session.errorMessage;
});

// Route to delete a user
router.post('/delete-user', isAuthenticated, isAdmin, async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await findUserById(userId);
        if (!user) {
            req.session.errorMessage = 'User not found';
            return res.redirect('back');
        }

        if (user.role_id !== 1) {
            await deleteUser(userId);
            req.session.successMessage = 'User deleted!';
        } else {
            req.session.errorMessage = 'You cannot delete an admin!';
        }
        res.redirect('back');
    } catch (error) {
        req.session.errorMessage = 'Error deleting user';
        res.redirect('back');
    }
});

// Route to display user list for admins
router.get('/userlist', isAuthenticated, isAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const usersPerPage = 10;

    try {
        const users = await getAllUsers(page, usersPerPage);
        const totalUsers = await getTotalUsers();
        const totalPages = Math.ceil(totalUsers / usersPerPage);

        res.render('userlist', {
            title: 'User List',
            users,
            page: "userlist",
            user: req.session.user,
            currentPage: page,
            totalPages,
            successMessage: req.session.successMessage,
            errorMessage: req.session.errorMessage,
        });
    } catch (error) {
        req.session.errorMessage = 'Error loading user list';
        res.redirect('back');
    }

    delete req.session.successMessage;
    delete req.session.errorMessage;
});

// Route for profile viewing
router.get(['/profile/:username', '/profile'], isAuthenticated, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const username = req.params.username || req.session.user.name;

    try {
        const profileUser = await getUserByUsername(username);
        const userId = profileUser.id;
        const isOwner = req.session.user.name.toLowerCase() === username.toLowerCase();
        const userFollowing = await isFollowing(req.session.user.id, profileUser.id);
        const posts = await showAllPosts(page, userId);
        const followerCount = await getFollowerCount(profileUser.id);

        const postsWithComments = await Promise.all(posts.map(async (post) => {
            post.comments = await getComments(post.id);
            return post;
        }));

        const total = await totalPosts(userId);
        const totalPages = Math.ceil(total / 10);

        res.render('profile', {
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
        req.session.errorMessage = 'Error retrieving profile or posts';
        res.redirect('/profile');
    }

    delete req.session.successMessage;
    delete req.session.errorMessage;
});

// Route to ban a user
router.post('/ban-user', isAuthenticated, isAdmin, async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await findUserById(userId);
        if (!user) {
            req.session.errorMessage = 'User not found';
            return res.redirect('back');
        }

        if (user.role_id === 1) {
            req.session.errorMessage = 'Cannot ban an Admin!';
            return res.redirect('back');
        }

        await banUser(userId);
        req.session.successMessage = 'User banned!';
        res.redirect('back');
    } catch (error) {
        req.session.errorMessage = 'Error banning user';
        res.redirect('back');
    }
});

// Route to unban a user
router.post('/unban-user', isAuthenticated, isAdmin, async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await findUserById(userId);
        if (!user) {
            req.session.errorMessage = 'User not found';
            return res.redirect('back');
        }

        if (user.role_id === 1) {
            req.session.errorMessage = 'Cannot ban an Admin!';
            return res.redirect('back');
        }

        await unbanUser(userId);
        req.session.successMessage = 'User unbanned!';
        res.redirect('back');
    } catch (error) {
        req.session.errorMessage = 'Error unbanning user';
        res.redirect('back');
    }
});

// Route to post a comment
router.post('/post-comment', isAuthenticated, async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.session.user.id;

    if (!content || content.trim() === '') {
        req.session.errorMessage = 'Comment cannot be empty';
        return res.redirect('back');
    }

    try {
        await createComment(postId, userId, content);
        req.session.successMessage = 'Comment posted!';
        res.redirect('back');
    } catch (error) {
        req.session.errorMessage = 'Error creating comment';
        res.redirect('back');
    }
});

// Registration route
router.post('/register', async (req, res) => {
    const { name, password } = req.body;

    try {
        await createUser(name, password);
        req.session.successMessage = 'Signup successful!';
        res.redirect('/login');
    } catch (error) {
        req.session.errorMessage = 'Username already exists';
        res.redirect('/signup');
    }
});

// Password change route
router.post('/change-password', isAuthenticated, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    try {
        const hashedPassword = await getUserPassword(userId);
        const isCorrect = await bcrypt.compare(oldPassword, hashedPassword);

        if (!isCorrect) {
            req.session.errorMessage = 'Old password not matching';
            return res.redirect('/settings');
        }

        await changePassword(userId, newPassword);
        req.session.successMessage = 'Password changed!';
        res.redirect('/settings');
    } catch (error) {
        req.session.errorMessage = 'Error changing password';
        res.redirect('/settings');
    }
});

// Admin password change route
router.post('/change-user-password', isAuthenticated, isAdmin, async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        await changePassword(userId, newPassword);
        req.session.successMessage = 'Password changed!';
        res.redirect('/userlist');
    } catch (error) {
        req.session.errorMessage = 'Error changing password';
        res.redirect('/userlist');
    }
});




// Login
router.post('/login', async (req, res) => {
    const { name, password, remember } = req.body;

    try {
        const user = await loginUser(name, password);
        
        if (!user) {
            req.session.errorMessage = 'Invalid username or password';
            return res.redirect('/login');
        }

        if (user.isBanned) {
            req.session.errorMessage = 'Your account is banned. Please contact support.';
            return res.redirect('/login');
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            role_id: user.role_id,
            isBanned: user.isBanned
        };

        if (remember) {
            res.cookie('userId', user.id, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        }

        req.session.successMessage = 'Login successful!';
        res.redirect('/');
    } catch (error) {
        req.session.errorMessage = 'Error logging in. Please try again later.';
        res.redirect('/login');
    }
});


router.post('/follow', isAuthenticated, async (req, res) => {
    const followedId = req.body.followedId; 
    const followerId = req.session.user.id; 

    try {
        await followUser(followerId, followedId);
        req.session.successMessage = 'User Followed!';
        res.redirect('back');
    } catch (error) {
        req.session.errorMessage = 'Failed to follow user!';
        res.redirect('back');
    }
});

router.post('/unfollow', isAuthenticated, async (req, res) => {
    const followedId = req.body.followedId; 
    const followerId = req.session.user.id; 
    try {
        await unfollowUser(followerId, followedId);
        req.session.successMessage = 'User Unfollowed!';
        res.redirect('back');
    } catch (error) {
        req.session.errorMessage = 'Failed to unfollow user!';
        res.redirect('back');
    }
});

module.exports = router; // Exporting the router to use in server.js