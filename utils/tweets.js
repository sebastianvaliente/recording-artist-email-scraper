const Twitter = require("twitter-lite");

const SEND_BEATS_BOT_USER_ID = "SendBeatsBot";
const USER_TWEETS_URL = "statuses/user_timeline";

/* twitter client config */
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_AT_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

const parseEmailsFromTweets = tweets => {
  return tweets
    .map(tweet => {
      const { text } = tweet;
      const result = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
      return result ? result[0] : null;
    })
    .filter(e => e);
};

const getTweetsFromSendBeatsBotAcc = (
  options = { maxId: "", storedTweetsArray: [], savedFirstTweetId: "", lastTweetDate: "" }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { maxId, storedTweetsArray, savedFirstTweetId, lastTweetDate } = options;

      /* api call stats */
      const params = {
        screen_name: SEND_BEATS_BOT_USER_ID,
        include_rts: 1,
        count: 200
      };
      if (maxId) params.max_id = maxId;

      /* api call */
      let tweets = await client.get(USER_TWEETS_URL, params);

      /* if there are still tweets to scrape */
      if (tweets.length > 0) {
        const firstTweetId = savedFirstTweetId || tweets[0].id_str;
        const lastTweet = tweets[tweets.length - 1];

        /* otherwise, iterate and fetch next page */
        resolve(
          getTweetsFromSendBeatsBotAcc({
            maxId: lastTweet.id,
            lastTweetDate: lastTweet.created_at,
            savedFirstTweetId: firstTweetId,
            storedTweetsArray: storedTweetsArray.concat(tweets)
          })
        );
        return;
      }

      resolve({
        tweets: storedTweetsArray
      });
    } catch (e) {
      reject(e);
    }
  });
};

const filterTweetsByDateRange = (tweets, dateRange) => {
  return tweets.filter(t => {
    const [minDate, maxDate] = dateRange.map(d => new Date(d));
    const tweetCreatedDate = new Date(t.created_at);
    const isCreatedAfterMinDate = tweetCreatedDate >= minDate;
    const isCreatedBeforeMaxDate = tweetCreatedDate <= maxDate;
    return isCreatedAfterMinDate && isCreatedBeforeMaxDate;
  });
};

function getEmailsFromTweets(dateRange) {
  return new Promise(async (resolve, reject) => {
    try {
      const { tweets } = await getTweetsFromSendBeatsBotAcc();
      const filteredTweets = filterTweetsByDateRange(tweets, dateRange);
      resolve(parseEmailsFromTweets(filteredTweets));
    } catch (e) {
      console.log("Error:", e);
      reject(e);
    }
  });
}

export default getEmailsFromTweets;
