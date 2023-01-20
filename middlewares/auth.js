module.exports = {
  ensureAuthenticated: function (req, res, next) {
    const isAuthenticated = req.session.passport === undefined ? false : true;
    if (isAuthenticated === true) {
      return next();
    }
    return res.status(422).json({
      isAuth: false,
      message: 'You are not Logged in',
    });
  },
  forwardAuthenticated: function (req, res, next) {
    const isAuthenticated = req.session.passport === undefined ? false : true;
    if (isAuthenticated === false) {
      return next();
    }
    return res.status(200).json({
      isAuth: true,
      message: 'Already Login in',
    });
  },
};
