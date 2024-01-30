import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/automation/datastores
 */
const ThxDataStore = DefineDatastore({
  name: "thxcoins",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    human_name: { type: Schema.types.string },
    total_coins: { type: Schema.types.integer },
    budget: { type: Schema.types.integer },
    // original_msg: { type: Schema.types.string },
    // updated_msg: { type: Schema.types.string },
  },
});

export default ThxDataStore ;
