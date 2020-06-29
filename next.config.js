const withLess = require("@zeit/next-less");

module.exports = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  env: {
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
    TWITTER_AT_KEY: process.env.TWITTER_AT_KEY,
    TWITTER_TOKEN_SECRET: process.env.TWITTER_TOKEN_SECRET
  }
});
