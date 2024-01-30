import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import ListenThanksWorkflow from "../workflows/listen_thx_workflow.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const messageTrigger: Trigger<typeof ListenThanksWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Message trigger",
  description: "Messages trigger for gratitude",
  workflow: `#/workflows/${ListenThanksWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: ['C0472TGMZK7','C06C0TMG6S1'],
    filter: {
      version: 1,
      root: {
        statement: "{{data.text}} CONTAINS '++'"
      }
    }
  },
  inputs: {
    message_ts: {
      value: TriggerContextData.Event.MessagePosted.message_ts,
    },
    channel: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
    user_id: {
      value: TriggerContextData.Event.MessagePosted.user_id,
    },
    message: {
      value: TriggerContextData.Event.MessagePosted.text,
    }
  },
};

export default messageTrigger;

// Example event MessagePosted payload
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