# Thankscoins app
This app is intended to be used with slack, it's a [next generation](https://api.slack.com/start) slack app. Which seems to have little traction.

## Intro
We want to have a Slack app to show gratitude to our colleagues.
The goal:
If I send you @username++, you get a thxcoin.

Acceptance criteria: 
1. Each user has a budget of 20 thxcoins per week.
2. ~The app has a `/top` command to see a leaderbord on the most thanked person~ There's a workflow trigger for seeing a top10 leaderboard for the most thanked users.
3. ~The app has a `/thx` to see the points you have.~ There's a workflow trigger for seeing your total_coins.
4. You cannot give thxpoints to youself.


## Architecture summarization
There are two triggers, each activating a workflow, and a single datastore to upsert or get our items, the datastore item is something like this:
| id         | human_name  | total_coins | budget |
|------------|-------------|-------------|--------|
| U123456789 | John.foobar | 10          | 20     |

Where
`id` = Slack user id
`human_name` = human readable name
`total_coins` = total aggregations of the coins you've received
`budget` = your budget for giving coins
