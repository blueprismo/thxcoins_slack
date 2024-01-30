import { DefineWorkflow, Schema, SlackAPI, SlackFunction } from "deno-slack-sdk/mod.ts";
import { GetStatsFunction } from "../functions/get_stats_function.ts";
/**

As the new generation slack apps have no slash commands, we will trigger the stats message via a link trigger
The link trigger will provide the top 10 most rewarded users, and also with another trigger it can get your stats (budget, how many coins do I have, etc.)

**/

const StatisticsThanksWorkflow = DefineWorkflow({
  callback_id: "stats_thanks",
  title: "Retrieve statistics workflow",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      } 
    },
    required: [],
  },
});

const users_results = StatisticsThanksWorkflow.addStep(
  GetStatsFunction,
  {
    channel: StatisticsThanksWorkflow.inputs.channel_id,
    user_id: StatisticsThanksWorkflow.inputs.user_id,
  }
)

StatisticsThanksWorkflow.addStep(
  Schema.slack.functions.SendMessage,{
    channel_id: StatisticsThanksWorkflow.inputs.channel_id,
    message: users_results.outputs.output_message,
  }
)

export default StatisticsThanksWorkflow;
