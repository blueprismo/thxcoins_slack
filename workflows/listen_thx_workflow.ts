import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
// import { ReturnSameMessageFunction } from "../functions/sample_function.ts";
import { ReceiveThanksFunction } from "../functions/receive_thanks_function.ts";
import { ExtractUserFunction } from "../functions/extract_user_function.ts";
//import { extract_user } from "../functions/misc_functions.ts";

/**
Our Trigger `message_trigger` will be the kickstart for this workflow.
After there's a message that contains "++" and is sent to any of the chanels declared in the trigger.
This workflow will be triggered, which will include the payload for the event:
// {
//   "team_id": "T0123ABC",
//   "enterprise_id": "E0123ABC",
//   "event_id": "Ev0123ABC",
//   "event_timestamp": 1630623713,
//   "type": "event",
//   "data": {
//     "channel_id": "C0123ABC",
//     "channel_type": "public/private/im/mpim",
//     "event_type": "slack#/events/message_posted",
//     "message_ts": "1355517523.000005",
//     "text": "Hello world",
//     "thread_ts": "1355517523.000006", // Nullable
//     "user_id": "U0123ABC",
//   }
// }
*/
const ListenThanksWorkflow = DefineWorkflow({
  callback_id: "listen_thanks",
  title: "Listen to gratitude workflow",
  input_parameters: {
    properties: {
      message_ts: {
        type: Schema.slack.types.message_ts,
        description: "Message timestamp",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel ID"
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      message:{
        type: Schema.types.string,
      } 
    },
    required: [],
  },
});

const users_results = ListenThanksWorkflow.addStep(
  ExtractUserFunction,
  {
    message: ListenThanksWorkflow.inputs.message,
    //user: ListenThanksWorkflow.inputs.user_id,
    // message_ts: ListenThanksWorkflow.inputs.message_ts,
    // channel_id: ListenThanksWorkflow.inputs.channel
  }
)

const give_coins = ListenThanksWorkflow.addStep(
  ReceiveThanksFunction,
  {
    plus_count: users_results.outputs.plus_count,
    giving_thanks_id: ListenThanksWorkflow.inputs.user_id,
    receiving_thanks_id: users_results.outputs.greeted_user_id,
    // message_ts: ListenThanksWorkflow.inputs.message_ts,
    // channel_id: ListenThanksWorkflow.inputs.channel
  }
)

ListenThanksWorkflow.addStep(
  Schema.slack.functions.SendMessage,{
    channel_id: ListenThanksWorkflow.inputs.channel,
    message: give_coins.outputs.updatedMsg,
    //user_id: ListenThanksWorkflow.inputs.user_id,
    //thread_ts: ListenThanksWorkflow.inputs.message_ts,
  }
)


export default ListenThanksWorkflow;
