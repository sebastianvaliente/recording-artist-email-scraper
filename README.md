sendbeatsto.vercel.app/

## How it works.
In short, we run a search for tweets with "send beats to" as the query. Then, all the emails are extracted from those tweets and returned to the user.

## How to use.
Simply select a range of dates, and click "Scrape Emails". When it's done, you'll have the option to copy all the retrieved emails to clipboard.

A couple things to note: The Twitter API only allows you to retrieve a certain amount of tweets at a time. For that reason, you can only select a date range as far as 30 days from today.

You should keep your own records of the emails you retrieve so you can filter the duplicates (assuming you use this more than once.) After you copy the emails, you can use "Paste Special" in Google Sheets and it'll paste each email into a cell.
