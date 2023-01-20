var dotenv = require('dotenv');

process.env.NODE_ENV === undefined || 'test'
  ? dotenv.config({ path: './dev.env' })
  : dotenv.config();
