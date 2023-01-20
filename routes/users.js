var express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { check } = require('express-validator');
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require('../middlewares/auth');

//@route GET user/requestpasswordreset
// @desc Request Password Reset
// @access Private

router.get(
  '/requestpasswordreset/:email',
  ensureAuthenticated,
  usersController.requestPasswordReset
);

//@route GET user/requestpasswordreset
// @desc Request Password Reset
// @access Private

router.get('/newpassword/:userid', usersController.newPassword);

// @route GET users/passwordreset
// @desc Reset Password
// Public

router.get('/confirmreset', usersController.confirmReset);

// @route GET user/login
// @desc Login a User
// @access Public

router.post(
  '/login',
  forwardAuthenticated,
  [
    check('email', 'Email is required!').not().isEmpty(),
    check('password', 'Passowrd is require').not().isEmpty(),
  ],
  usersController.loginUser
);

// @route GET user/logout
// @desc Logout a User
// @access Public

router.get('/logout', ensureAuthenticated, usersController.logoutUser);

// @route POST api/v1/user
// @desc Create a User
// @access Public

router.post('/', usersController.addUser);

// @route GET api/user
// @desc Fetch all users
// @access Private

router.get('/', usersController.getAllUsers);

// @route GET api/v1/user/:id
// @desc Get a user by ID
// @access Private

router.get('/:id', usersController.getUserByID);

// @route PATCH api/v1/:id
// @desc update a lesson by ID
// @access Private
router.patch('/:id', usersController.updateUserByID);

// @route DELETE api/v1/:id
// @desc delete a lesson by ID
// @access Private

router.delete('/:id', usersController.deleteUserByID);

module.exports = router;
