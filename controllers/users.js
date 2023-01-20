const Users = require('../models/users');
const Hash = require('../models/hash');
var bcrypt = require('bcrypt');
var asyncWrapper = require('../middlewares/asyncWrapper');
var randomToken = require('random-token');
const { validationResult } = require('express-validator');
var passport = require('passport');
require('../middlewares/passport.js');

// To be moved to auth
var Tokens = require('../models/token');
var Crypto = require('crypto');
var sendEmail = require('../middlewares/sendEmail');
var moment = require('moment');

exports.requestPasswordReset = asyncWrapper(async (req, res, next) => {
  const { email } = req.params;

  const user = await Users.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: 'User Not Found' });
  }

  let resetToken = Crypto.randomBytes(32).toString('hex');

  let hashToken = await bcrypt.hash(resetToken, 10);

  const newToken = {
    id: randomToken(32),
    userid: user.id,
    token: hashToken,
    created_at: Date.now(),
  };

  const tokenID = await Tokens.addToken(newToken);

  const link = `http://localhost:7240/users/confirmreset?token=${resetToken}&id=${tokenID[0].id}`;

  let content = `<h1>Password Reset</h1><p>Click on the link to reset your password <a href=${link} >Reset</a></p>`;

  //await sendEmail(user.email, content);

  return res.status(200).json({ link });
});

exports.confirmReset = asyncWrapper(async (req, res, next) => {
  const { id, token } = req.query;

  const dbtoken = await Tokens.findTokenById(id);

  const isMatch = bcrypt.compareSync(token, dbtoken.token);

  const tokenDuration = moment(dbtoken.created_at)
    .startOf('second')
    .fromNow()
    .split(' ')[0];
  //console.log({ dbtoken, isMatch, tokenMinutes });
  const tokenMinutes = tokenDuration === 'a' ? 0 : parseInt(tokenDuration);
  if (isMatch === true && tokenMinutes < 3) {
    return res.redirect(`/users/newpassword/${dbtoken.userid}`);
  }

  return res.status(500).json({ message: 'Something went wrong' });
});

exports.newPassword = asyncWrapper(async (req, res, next) => {
  const { userid } = req.params;

  const password = 'AkpenaMawu';
  const hspwd = await bcrypt.hash(password, 10);

  const newHash = { id: userid, hash: hspwd };
  console.log(newHash);

  await Hash.updateHashByID(userid, newHash);

  res.status(200).json({ message: 'Password Reset Successfull' });
});

exports.loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation Failed',
      error: errors.errors,
    });
  }
  passport.authenticate('local', {
    successRedirect: '/success_login',
    failureRedirect: '/unsuccess_login',
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie(process.env.SESSION_COOKIE_NAME);
    res.status(200).json({
      isAuth: false,
      message: 'successfuly logged out',
    });
  });
};

exports.addUser = asyncWrapper(async (req, res, next) => {
  const id = randomToken(32);

  const { fname, lname, email, password } = req.body;

  const newUser = { fname, lname, email, id };

  const user = await Users.addUser(newUser);

  const hspwd = await bcrypt.hash(password, 10);

  const newHash = { id: id, hash: hspwd };

  await Hash.addHash(newHash);

  return res.status(201).json(user);
});

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
  const dbUsers = await Users.findAllUSers();
  res.status(200).json(dbUsers);
});

exports.getUserByID = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const dbUser = await Users.findUserByID(id);
  dbUser === undefined
    ? res.status(404).json({ msg: `User with id ${id} not found` })
    : res.status(200).json(dbUser);
});

exports.updateUserByID = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;
  const dbUser = await Users.updateUser(id, changes);
  dbUser === undefined
    ? res.status(404).json({ msg: `User with id ${id} not found` })
    : res.status(200).json(dbUser);
});

exports.deleteUserByID = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const delLesson = await Users.removeUserByID(id);
  delLesson === undefined
    ? res.status(404).json({ msg: `User with id ${id} not found` })
    : res.status(400).json({ msg: 'User was deleted successfully' });
});
