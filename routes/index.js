var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var sendEmail = require('../middlewares/sendEmail');

var lessonRoutes = require('./lesson');
var usersRoutes = require('./users');

const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/get-session', ensureAuthenticated, async (req, res) => {
  const userid = req.session.passport.user;
  const newUser = await Users.findUserByID(userid);

  return res.status(200).json(newUser);
});

router.get('/success_login', (req, res, next) => {
  console.log(req.user);
  res.status(200).json({
    isAuth: true,
    message: 'Login in was successfull',
  });
});

router.get('/unsuccess_login', (req, res, next) => {
  res.status(400).json({
    isAuth: false,
    message: 'Invalid Email/Password Combination',
  });
});

router.post('/email', (req, res, next) => {
  sendEmail()
    .then((response) => res.status(200).send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

router.use('/lessons', lessonRoutes);
router.use('/users', usersRoutes);

module.exports = router;
