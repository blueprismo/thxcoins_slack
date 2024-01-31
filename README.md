# Thankscoins app
This app is intended to be used with slack, it's a [next generation](https://api.slack.com/start) slack app. Which seems to have little traction.

## Intro
We want to have a Slack app to show gratitude to our colleagues.
The goal:
If I write @username++, you get a thxcoin.
If I write ++ @username +++, you get 3 thxcoins.

Acceptance criteria: 
1. Each user has a budget of 20 thxcoins per week. This is done thanks to the schedule trigger
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

There are three main workflows, each triggered by a it's unique trigger.
### Message trigger:
This filters all the "++" messages in the specified channels, then filters the thanked user and the one giving thanks

### Link trigger:
This was suposed to be a slack slash command but in next-gen apps it's not allowed anymore, so it is a link that provides statistics about the top 10 users that are thanked

### Schedule trigger:
This is a cron that runs every Sunday and refills the users whose budget is less than the maximum (20).


## Usage
Please fill in the desired slack channels in `triggers/message_trigger.ts`, then `slack run` to ensure the workflows work as expected
