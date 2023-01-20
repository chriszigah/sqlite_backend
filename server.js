require('./config/config');
require('express-async-errors');
const express = require('express');
var cookieParser = require('cookie-parser');
var fs = require('fs');
const path = require('path');
var passport = require('passport');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var morgan = require('morgan');
var helmet = require('helmet');

const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const indexRouter = require('./routes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy');

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// Cookie Parser
app.use(cookieParser());

//Session
const cookieKey = process.env.COOKIE_SESSION_KEY;
const cookieName = process.env.COOKIE_SESSION_NAME;
const cookieExpires = process.env.COOKIE_EXPIRATION_MS;

app.use(
  session({
    store: new SQLiteStore(),
    secret: cookieKey,
    name: cookieName,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    Cookie: {
      path: '/',
      secure: true,
      expires: Date.now() + parseInt(cookieExpires, 10),
      maxAge: parseInt(cookieExpires, 10),
      httpOnly: true,
      sameSite: true,
    },
  })
);

// Helmet (no-cache)
app.use(helmet());

// Morgan Logs
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, './logs/access.log'),
  {
    flags: 'a',
  }
);
app.use(morgan('dev'));
app.use(morgan('combined'));
app.use(morgan('combined', { stream: accessLogStream }));
morgan.token('sessionid', function (req, res, param) {
  return req.sessionID ? req.sessionID : 'NO SESSION ';
});

morgan.token('user', function (req, res, param) {
  try {
  } catch (error) {
    return null;
  }
});

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :user :sessionid'
  )
);

// Routes
app.use('/', indexRouter);

//Error Handler
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 7242;

const start = async () => {
  try {
    // Connect SQLITE3 DB
    app.listen(
      port,
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${port}`
      )
    );
  } catch (error) {
    console.log('Something went wrong');
  }
};

process.env.NODE_ENV === 'test' ? (module.exports = app) : start();
