import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { RefillThanksFunction } from "../functions/refill_thanks_function.ts";
/**

This workflow will refill all the users from the database a maximum of 20 thankscoins per week
if user has 20 coins, no need to do anything.

**/

const RefillThanksWorkflow = DefineWorkflow({
  callback_id: "refill_thanks",
  title: "Refill thanks budget for every existing user",
});

const users_results = RefillThanksWorkflow.addStep(
  RefillThanksFunction,{}
)

RefillThanksWorkflow.addStep(
  Schema.slack.functions.SendMessage,{
    // send outputs of message to #sre-squad channel ()
    channel_id: "C02RL7JPM0U",
    message: users_results.outputs.output_message,
  }
)

export default RefillThanksWorkflow;
