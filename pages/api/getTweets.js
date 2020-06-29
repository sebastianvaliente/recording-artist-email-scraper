import getEmailsFromTweets from "../utils/tweets";

export default async (req, res) => {
  if (!req.headers.dates) return;
  const dates = JSON.parse(req.headers.dates);
  const emails = await getEmailsFromTweets(dates);
  res.send({ emails });
};
