import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import StatisticsThanksWorkflow from "../workflows/stats_thx_workflow.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const statsTrigger: Trigger<typeof StatisticsThanksWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Setup a Welcome Message",
  description: "Creates an automated welcome message for a given channel.",
  workflow: `#/workflows/${StatisticsThanksWorkflow.definition.callback_id}`,
  inputs: {
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    }
  },
};

export default statsTrigger;
