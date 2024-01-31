import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import RefillThanksWorkflow from "../workflows/schedule_refill_workflow.ts"
/**
 This trigger will just add 20 thxcoins every week for every user
 
**/
const scheduledThxTrigger: Trigger<typeof RefillThanksWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Refill thankscoins weekly",
  description: "Refills thankscoins to each user on a weekly basis",
  workflow: `#/workflows/${RefillThanksWorkflow.definition.callback_id}`,
  //inputs: {},
  schedule: {
    // Starts 60 seconds after creation
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    frequency: {
      type: "weekly",
      repeats_every: 1,
      on_days: ["Sunday"]
    }
  }
};

export default scheduledThxTrigger;
